import type { FunctionalComponent } from 'preact';
import { createContext, h } from 'preact';
import { Routes } from './routes/Routes';
import './App.scss';
import type { User } from './components/Db/User';
import type { StateUpdater } from 'preact/hooks';
import { useEffect, useState } from 'preact/hooks';
import { i18n, npgettextFunc, pgettextFunc } from './utils/gettext';
import msg_ru from './i18n/messages.ru.json';
import msg_en from './i18n/messages.en.json';

export interface IUserContext {
	user?: User,
	setUser?: StateUpdater<User | undefined>
}

export const UserContext = createContext<IUserContext>({});

export interface I18NContext {
	lang: string;
	_p: pgettextFunc;
	_np: npgettextFunc;
	setLang: (locale: string) => void;
}

const gettext = i18n();
gettext.loadJSON(msg_ru);
gettext.loadJSON(msg_en);

const i18nEmpty: I18NContext = {
	lang: gettext.getLocale(),
	_p: () => '',
	_np: () => '',
	setLang: () => {
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
			_p: (msgctx, msgid, ...args) => gettext.pgettext(msgctx, msgid, ...args),
			_np: (msgctx, msgid, msgid_plural, n, ...args) => gettext.npgettext(msgctx, msgid, msgid_plural, n, ...args),
			setLang: (locale: string) => {
				gettext.setLocale(locale);
				setLang(gettext.getLocale());
			},
		});
	}, [lang, setGetText]);

	useEffect(() => {
		setLang(navigator.language.split('-')[0]);
	}, []);

	return <i18nContext.Provider value={getText}>
		<UserContext.Provider value={{
			user,
			setUser,
		}}>
			<Routes />
		</UserContext.Provider>
	</i18nContext.Provider>;
};
