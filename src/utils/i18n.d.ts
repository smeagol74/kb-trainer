// Type definitions for gettext.js 0.8
// Project: https://github.com/guillaumepotier/gettext.js
// Definitions by: Julien Crouzet <https://github.com/jucrouzet>
//                 Florian Schwingenschlögl <https://github.com/FlorianSchwingenschloegl>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export type PluralForm = (n: number) => number;

export type GettextStatic = (options?: GettextOptions) => Gettext;

export interface GettextOptions {
	domain?: string;
	locale?: string;
	plural_func?: PluralForm;
	ctxt_delimiter?: string;
}

export interface JsonDataHeader {
	language: string;
	'plural-forms': string;
}

export interface JsonDataMessages {
	[key: string]: string | string[] | JsonDataHeader;
}

export interface JsonData extends JsonDataMessages {
	'': JsonDataHeader;
}

export type gettextFunc = (msgid: string, ...args: any[]) => string;
export type ngettextFunc = (msgid: string, msgid_plural: string, n: number, ...args: any[]) => string;
export type pgettextFunc = (msgctx: string, msgid: string, ...args: any[]) => string;
export type npgettextFunc = (msgctx: string, msgid: string, msgid_plural: string, n: number, ...args: any[]) => string;

export interface Gettext {
	setMessages(domain: string, locale: string, messages: JsonDataMessages, plural_forms?: PluralForm): Gettext;

	loadJSON(jsonData: JsonData, domain?: string): Gettext;

	setLocale(locale: string): Gettext;

	getLocale(): string;

	textdomain(domain?: string): Gettext | string;

	gettext: gettextFunc;

	ngettext: ngettextFunc;

	pgettext: pgettextFunc;

	npgettext: npgettextFunc;

	dcnpgettext(domain: string, msgctxt: string, msgid: string, msgid_plural: string, n: number, ...args: any[]): string;

	__: gettextFunc;

	_n: ngettextFunc;

	_p: pgettextFunc;

	_np: npgettextFunc;
}

export const i18n: GettextStatic;
