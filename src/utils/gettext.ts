import { i18n } from './i18n';
import msg_ru from '../i18n/messages.ru.json';
import msg_en from '../i18n/messages.en.json';

export function setHtmlLang(lang: string) {
	const htmls = document.getElementsByTagName<'html'>('html');
	const html = htmls.item(0);
	html?.setAttribute('lang', lang);
}

export const gettext = i18n();
gettext.loadJSON(msg_ru);
gettext.loadJSON(msg_en);

function _navigatorLanguage(): string {
	if (navigator.languages.indexOf('ru') > -1) {
		return 'ru';
	} else {
		return 'en';
	}
}

const lang = _navigatorLanguage();
gettext.setLocale(lang);
setHtmlLang(lang);
