import { h, render } from 'preact';
import { App } from './App';
import { Db } from './components/Db/Db';
import jsLogger from 'js-logger';

jsLogger.useDefaults();

jsLogger.setLevel(jsLogger.DEBUG);
jsLogger.get('TypingLine').setLevel(jsLogger.ERROR);

const log = jsLogger.get('index');

Db.loadDefaults()
	.then(() => {
		log.info('Database defaults loaded.');

		history.replaceState(0, '', '/');

		render(<App />, document.body);
	});

