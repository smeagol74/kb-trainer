import { h, render } from 'preact';
import { App } from './App';
import { Db } from './components/Db/Db';

Db.keyboard.loadDefaults().then();

history.replaceState(0, '', '/');

render(<App/>, document.body);
