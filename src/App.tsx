import type { FunctionalComponent } from 'preact';
import { createContext, h } from 'preact';
import { Routes } from './routes/Routes';
import './App.scss';
import type { User } from './components/Db/User';
import type { StateUpdater } from 'preact/hooks';
import { useEffect, useState } from 'preact/hooks';
import { gettext, setHtmlLang } from './utils/gettext';
import type { npgettextFunc, pgettextFunc } from './utils/i18n';

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

const i18nEmpty = (): I18NContext => ({
	lang: gettext.getLocale(),
	_p: () => '',
	_np: () => '',
	setLang: () => {
	},
});

export const i18nContext = createContext<I18NContext>(i18nEmpty());

export const App: FunctionalComponent<{}> = () => {
	const [user, setUser] = useState<User | undefined>(undefined);
	const [getText, setGetText] = useState<I18NContext>(i18nEmpty());
	const [lang, setLang] = useState<string>(gettext.getLocale());

	useEffect(() => {
		setGetText({
			lang: lang,
			_p: (msgctx, msgid, ...args) => gettext.pgettext(msgctx, msgid, ...args),
			_np: (msgctx, msgid, msgid_plural, n, ...args) => gettext.npgettext(msgctx, msgid, msgid_plural, n, ...args),
			setLang: (locale: string) => {
				gettext.setLocale(locale);
				setLang(gettext.getLocale());
				setHtmlLang(gettext.getLocale());
			},
		});
	}, [lang, setGetText, setLang]);

	return <i18nContext.Provider value={getText}>
		<UserContext.Provider value={{
			user,
			setUser,
		}}>
			<Routes />
		</UserContext.Provider>
	</i18nContext.Provider>;
};
