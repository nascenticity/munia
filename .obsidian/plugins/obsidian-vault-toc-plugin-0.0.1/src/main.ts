import { App, Notice, Plugin, PluginSettingTab, Setting } from "obsidian";
import type { PluginSettings } from "./types";
import { generateToC } from "./generator";

const DEFAULT_SETTINGS: PluginSettings = {
	fileName: "TOC",
	markEmptyFiles: true,
	emptyThreshold: 100,
};

export default class VaultToCPlugin extends Plugin {
	settings: PluginSettings;

	async createToC() {
		const files = this.app.vault.getMarkdownFiles();
		const toc = generateToC(files, this.settings);

		const outFileName = `${this.settings.fileName}.md`;
		let outFile = this.app.vault.getAbstractFileByPath(outFileName);
		if (outFile) {
			this.app.vault.delete(outFile);
		}
		this.app.vault.create(outFileName, toc);

		// TODO: open the file
		new Notice("Table of Content is generated");
	}

	async onload() {
		await this.loadSettings();

		this.addRibbonIcon("list-tree", "Vault ToC", async () => {
			await this.createToC();
		});

		this.addCommand({
			id: "generate-toc",
			name: "Generate Table of Contents for the Vault",
			callback: async () => {
				await this.createToC();
			},
		});

		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: VaultToCPlugin;

	constructor(app: App, plugin: VaultToCPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("File name")
			.setDesc("Where the Terms of Contents will be stored")
			.addText((text) =>
				text
					.setPlaceholder("File name without extension")
					.setValue(this.plugin.settings.fileName)
					.onChange(async (value) => {
						this.plugin.settings.fileName = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl)
			.setName("Highlight empty files")
			.setDesc("Add a marker if a file is empty")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.markEmptyFiles)
					.onChange(async (value) => {
						this.plugin.settings.markEmptyFiles = value;
						await this.plugin.saveSettings();
						this.display();
					})
			);
		if (this.plugin.settings.markEmptyFiles) {
			new Setting(containerEl)
				.setName("Empty threshold")
				.setDesc(
					'How many symbols a file should contain to be not "empty"'
				)
				.addSlider((slider) =>
					slider
						.setValue(this.plugin.settings.emptyThreshold)
						.setLimits(0, 100, 5)
						.onChange(async (value) => {
							slider.showTooltip();
							this.plugin.settings.emptyThreshold = value;
							await this.plugin.saveSettings();
						})
				);
		}
	}
}
