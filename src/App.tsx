import type { FunctionalComponent } from 'preact';
import { createContext, h } from 'preact';
import { Routes } from './routes/Routes';
import './App.scss';
import type { User } from './components/Db/User';
import type { StateUpdater } from 'preact/hooks';
import { useState } from 'preact/hooks';

export interface IUserContext {
	user?: User,
	setUser?: StateUpdater<User|undefined>
}

export const UserContext = createContext<IUserContext>({});

export const App: FunctionalComponent<{}> = () => {
	const [user, setUser] = useState<User | undefined>(undefined);
	return <UserContext.Provider value={{
		user,
		setUser
	}}>
		<Routes />
	</UserContext.Provider>;
};
