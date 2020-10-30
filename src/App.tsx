import type { FunctionalComponent } from 'preact';
import { Routes } from './routes/Routes';
import { h } from 'preact';
import './App.scss';

export const App: FunctionalComponent<{}> = () => {
	return <Routes/>;
}
