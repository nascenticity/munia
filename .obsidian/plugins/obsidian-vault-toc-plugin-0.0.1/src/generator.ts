import type { TFile, TFolder } from "obsidian";
import { PluginSettings, TableOfContents } from "./types";
import { DefaultFormatter } from "./formatters";

function makeSection(): TableOfContents {
	return { files: [], children: {} };
}

// B -> A -> null
// Will be roughly transformed to {A: {B: {files: []}}
function ensureParents(path: TFolder, toc: TableOfContents): TableOfContents {
	if (path.parent?.name === "") {
		if (path.name in toc.children) {
			return toc.children[path.name];
		}
		const section = makeSection();
		toc.children[path.name] = section;
		return section;
	}
	if (path.parent && path.parent.name !== "") {
		const container = ensureParents(path.parent, toc);
		if (path.name in container.children) {
			return container.children[path.name];
		}
		const section = makeSection();
		container.children[path.name] = section;
		return section;
	}
	return toc;
}

function updateToC(path: TFile, toc: TableOfContents) {
	let container = toc;
	if (path.parent && path.parent.name !== "") {
		container = ensureParents(path.parent, toc);
	}
	container.files.push({ name: path.basename, size: path.stat.size });
}

export function generateToC(files: TFile[], settings: PluginSettings) {
	const toc = makeSection();

	for (const md of files) {
		updateToC(md, toc);
	}
	const formatter = new DefaultFormatter(settings);
	const output = formatter.format(toc);
	return output;
}
