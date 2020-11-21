import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import { Icon } from '../Icon/Icon';

import 'intro.js/introjs.css';

import introJs from 'intro.js';
import { useRef } from 'preact/hooks';
import './Intro.scss';
import { parentWithClass } from '../../utils/dom';

export interface IIntroProps {
	global?: boolean;
}

export const IntroContainerClass = 'Intro__container';

export const Intro: FunctionalComponent<IIntroProps> = ({ global }) => {

	const ref = useRef<HTMLDivElement>();

	function _onClick() {
		if (global) {
			introJs().start();
		} else {
			const intro = parentWithClass(IntroContainerClass, ref.current);
			if (intro) {
				introJs(intro).start();
			}
		}
	}

	return (<div {...{
		ref: ref,
		className: 'Intro',
		onClick: _onClick,
	}}>
		<Icon {...{
			img: 'help-6',
		}} />
	</div>);
};
