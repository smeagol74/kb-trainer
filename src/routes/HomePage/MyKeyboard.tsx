import './MyKeyboard.scss';
import type { FunctionalComponent } from 'preact';
import type { Keyboard } from '../../components/Db/Keyboard';
import { h } from 'preact';

export interface IMyKeyboardProps {
	keyboard: Keyboard
}

export const MyKeyboard: FunctionalComponent<IMyKeyboardProps> = ({keyboard}) => {
	return <div>
		{keyboard.name}
	</div>
}
