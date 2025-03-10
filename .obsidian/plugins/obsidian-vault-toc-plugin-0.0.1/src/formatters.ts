import { PluginSettings, TableOfContents } from "./types";

class BaseFormatter {
	settings: PluginSettings;

	constructor(settings: PluginSettings) {
		this.settings = settings;
	}
}

interface IFormatter extends BaseFormatter {
	format(toc: TableOfContents, level: number, path: string): string;
}

export class DefaultFormatter extends BaseFormatter implements IFormatter {
	format(toc: TableOfContents, level = 0, path = ""): string {
		const st = this.settings; // shorthand

		let s = level ? "" : "- **Root level**\n";

		const sortedFiles = toc.files.sort((a, b) =>
			a.name > b.name ? 1 : -1
		);
		for (const f of sortedFiles) {
			const indent = " ".repeat(level ? level * 2 : 2);
			const href = `${path}/${f.name}.md`;
			const marker =
				st.markEmptyFiles && f.size < st.emptyThreshold ? "🚧 " : "";
			const link = `[[${href}|${marker}${f.name}]]`;
			s += `${indent}- ${link}\n`;
		}

		const folders = Object.keys(toc.children).sort((a, b) =>
			a > b ? 1 : -1
		);
		for (const folder of folders) {
			const indent = " ".repeat(level * 2);
			s += `${indent}- **${folder}**\n`;
			s += this.format(
				toc.children[folder],
				level + 1,
				`${path}/${folder}`
			);
		}

		return s;
	}
}
