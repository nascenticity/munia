export type PluginSettings = {
	fileName: string;
	markEmptyFiles: boolean;
	emptyThreshold: number;
};

export type TableOfContents = {
	files: { name: string; size: number }[];
	children: {
		[key: string]: TableOfContents;
	};
};
