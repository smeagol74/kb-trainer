import type { FunctionalComponent } from 'preact';
import { createContext, h } from 'preact';
import { Routes } from './routes/Routes';
import './App.scss';
import type { User } from './components/Db/User';
import type { StateUpdater } from 'preact/hooks';
import { useEffect, useState } from 'preact/hooks';
import { i18n } from './utils/gettext';
import msg_ru from './i18n/messages.ru.json';

export interface IUserContext {
	user?: User,
	setUser?: StateUpdater<User | undefined>
}

export const UserContext = createContext<IUserContext>({});

export interface I18NContext {
	lang: string;
	__: (msgid: string, ...args: any[]) => string;
	_n: (msgid: string, msgid_plural: string, n: number, ...args: any[]) => string;
	setLang: (locale: string) => void;
}

const gettext = i18n();
gettext.loadJSON(msg_ru);

const i18nEmpty = {
	lang: gettext.getLocale(),
	__: (msgid: string, ...args: any[]) => '',
	_n: (msgid: string, msgid_plural: string, n: number, ...args: any[]) => '',
	setLang: (locale: string) => {
	},
};


export const i18nContext = createContext<I18NContext>(i18nEmpty);

export const App: FunctionalComponent<{}> = () => {
	const [user, setUser] = useState<User | undefined>(undefined);
	const [getText, setGetText] = useState<I18NContext>(i18nEmpty);
	const [lang, setLang] = useState<string>(gettext.getLocale());

	useEffect(() => {
		setGetText({
			lang: lang,
			__: (msgid: string, ...args: any[]) => gettext.gettext(msgid, args),
			_n: (msgid: string, msgid_plural: string, n: number, ...args: any[]) => gettext.ngettext(msgid, msgid_plural, n, args),
			setLang: (locale: string) => {
				gettext.setLocale(locale);
				setLang(gettext.getLocale());
			},
		});
	}, [lang, setGetText]);

	return <i18nContext.Provider value={getText}>
		<UserContext.Provider value={{
			user,
			setUser,
		}}>
			<Routes />
		</UserContext.Provider>
	</i18nContext.Provider>;
};
