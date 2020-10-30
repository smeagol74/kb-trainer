import { h, render } from 'preact';
import { App } from './App';


history.replaceState(0, '', '/');

render(<App/>, document.body);
