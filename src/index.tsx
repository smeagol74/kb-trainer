import { h, render } from 'preact';
import { App } from './App';
import { Db } from './components/Db/Db';

Db.loadDefaults()
	.then(() => {
		console.log('Database defaults loaded.');

		history.replaceState(0, '', '/');

		render(<App />, document.body);
	});

