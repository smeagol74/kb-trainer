export enum OS {
	UNKNOWN = 'UNKNOWN',
	WINDOWS = 'WINDOWS',
	MACOS = 'MACOS',
	LINUX = 'LINUX',
	UNIX = 'UNIX'
}

export function os(): OS {
	let result = OS.UNKNOWN;
	if (navigator.appVersion.indexOf('Win') != -1) result = OS.WINDOWS;
	if (navigator.appVersion.indexOf('Mac') != -1) result = OS.MACOS;
	if (navigator.appVersion.indexOf('X11') != -1) result = OS.UNIX;
	if (navigator.appVersion.indexOf('Linux') != -1) result = OS.LINUX;
	return result;
}
