export const MIMEMAP = new Map<string, string>([
	// Images
	[".apng", "image/apng"],
	[".avif", "image/avif"],
	[".bmp", "image/bmp"],
	[".gif", "image/gif"],
	[".ico", "image/vnd.microsoft.icon"],
	[".cur", "image/x-icon"],
	[".jpg", "image/jpeg"],
	[".jpeg", "image/jpeg"],
	[".jfif", "image/jpeg"],
	[".pjpeg", "image/pjpeg"],
	[".pjp", "image/pjpeg"],
	[".png", "image/png"],
	[".svg", "image/svg+xml"],
	[".tif", "image/tiff"],
	[".tiff", "image/tiff"],
	[".webp", "image/webp"],

	// Video
	[".mp4", "video/mp4"],
	[".m4v", "video/x-m4v"],
	[".mkv", "video/x-matroska"],
	[".mov", "video/quicktime"],
	[".avi", "video/x-msvideo"],
	[".webm", "video/webm"],
	[".ogv", "video/ogg"],

	// Audio
	[".mp3", "audio/mpeg"],
	[".m4a", "audio/mp4"],
	[".aac", "audio/aac"],
	[".oga", "audio/ogg"],
	[".wav", "audio/wav"],
	[".weba", "audio/webm"],
	[".flac", "audio/flac"],
	[".mid", "audio/midi"],
	[".midi", "audio/midi"],

	// Text
	[".txt", "text/plain"],
	[".csv", "text/csv"],
	[".css", "text/css"],
	[".htm", "text/html"],
	[".html", "text/html"],
	[".js", "text/javascript"],
	[".mjs", "text/javascript"],
	[".ts", "text/typescript"],
	[".json", "application/json"],
	[".xml", "application/xml"],
	[".yaml", "application/x-yaml"],
	[".yml", "application/x-yaml"],
	[".md", "text/markdown"],

	// Documents
	[".pdf", "application/pdf"],
	[".doc", "application/msword"],
	[".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
	[".xls", "application/vnd.ms-excel"],
	[".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
	[".ppt", "application/vnd.ms-powerpoint"],
	[".pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
	[".odt", "application/vnd.oasis.opendocument.text"],
	[".ods", "application/vnd.oasis.opendocument.spreadsheet"],
	[".odp", "application/vnd.oasis.opendocument.presentation"],
	[".rtf", "application/rtf"],

	// Archives
	[".zip", "application/zip"],
	[".gz", "application/gzip"],
	[".tar", "application/x-tar"],
	[".bz2", "application/x-bzip2"],
	[".7z", "application/x-7z-compressed"],
	[".rar", "application/vnd.rar"],

	// Fonts
	[".ttf", "font/ttf"],
	[".otf", "font/otf"],
	[".woff", "font/woff"],
	[".woff2", "font/woff2"],

	// Others
	[".wasm", "application/wasm"],
	[".sh", "application/x-sh"],
	[".exe", "application/vnd.microsoft.portable-executable"],
	[".bin", "application/octet-stream"],
]);

export const DEFAULT_MIME = "application/octet-stream";