import './MyKeyboard.scss';
import type { FunctionalComponent } from 'preact';
import type { Keyboard } from '../../components/Db/Keyboard';
import { h } from 'preact';
import _ from 'lodash';

export interface IOtherKeyboardProps {
	keyboard: Keyboard
}

export const OtherKeyboard: FunctionalComponent<IOtherKeyboardProps> = ({keyboard}) => {
	return <div>
		<div>{keyboard.name}</div>
		<div>{keyboard.description}</div>
		<div>{_(keyboard.script).map('keys').flatten().size()}</div>
	</div>
}
