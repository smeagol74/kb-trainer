import { os, OS } from './browser';

const keys: Dict<Dict<string>> = {
	Meta: {
		[OS.WINDOWS]: 'Win',
		[OS.MACOS]: 'Cmd',
		[OS.UNIX]: 'Meta',
		[OS.LINUX]: 'Meta',
	},
};

export function keyName(key: string): string {
	return keys?.[key]?.[os()] ?? key;
}
