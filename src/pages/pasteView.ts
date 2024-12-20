import type { Visibility } from '../createPaste';
import content from './pasteView.html';
import he from 'he';

type Args = {
	domain: string;
	githubRepoUrl: string;
	title: string | null;
	createdAt: string | null;
	createdBy: string | null;
	expirationSeconds: number | null;
	visibility: Visibility;
	highlightLang: string | null;
	paste: string;
};

const newPastePage = ({
	domain,
	githubRepoUrl,
	title,
	createdAt,
	createdBy,
	expirationSeconds,
	visibility,
	highlightLang,
	paste,
}: Args) => {
	const parsedCreatedAt = createdAt ? new Date(createdAt) : null;
	const parsedExpiresAt = parsedCreatedAt && expirationSeconds ? new Date(parsedCreatedAt.getTime() + expirationSeconds * 1000) : null;

	const metadataItems = [];
	if (createdBy) {
		metadataItems.push(`Created by: ${createdBy}`);
	}
	if (parsedCreatedAt) {
		metadataItems.push(parsedCreatedAt.toLocaleString());
	}
	if (parsedExpiresAt) {
		metadataItems.push(`Expires: ${parsedExpiresAt.toLocaleString()}`);
	}

	let extraIncludes = '';
	let prismClassname = '';
	if (highlightLang) {
		extraIncludes = [
			`<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"></script>`,
			`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prism-themes@1.9.0/themes/prism-dracula.min.css">`,
		].join('\n');
		prismClassname = `language-${he.escape(highlightLang)}`;
	}

	return content
		.replaceAll('{{DOMAIN}}', he.escape(domain))
		.replaceAll('{{GH_REPO_URL}}', he.escape(githubRepoUrl))
		.replaceAll('{{TITLE}}', he.escape(title || 'Untitled Paste'))
		.replaceAll('{{METADATA_ITEMS}}', he.escape(metadataItems.join(' • ')))
		.replaceAll('{{PRIVACY}}', visibility === 'public' ? 'Public' : 'Logged-in users only')
		.replaceAll('{{EXTRA_HEAD_CONTENT}}', extraIncludes)
		.replaceAll('{{PRISM_CLASSNAME}}', prismClassname)
		.replaceAll('{{PASTE_CONTENT}}', he.escape(paste));
};

export default newPastePage;
