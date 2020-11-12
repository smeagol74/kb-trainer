import { Fragment, FunctionalComponent, h } from 'preact';
import type { KeyboardLesson } from '../Db/Keyboard';
import { Icon } from '../Icon/Icon';
import _ from 'lodash';
import { useContext } from 'preact/hooks';
import { i18nContext } from '../../App';

export interface ILessonLabelProps {
	keyboard: string;
	lesson: KeyboardLesson;
	lessonNumber: number;
}

export const LessonLabel: FunctionalComponent<ILessonLabelProps> = ({ keyboard, lesson, lessonNumber }) => {
	const { __ } = useContext(i18nContext);

	return <Fragment>
		<Icon img="keyboard-4" size="lg" /> {keyboard} – <Icon img="education-1" size="lg" />
		{__('Lesson %1.', lessonNumber)}
		{_.map(lesson, (k, idx) => <kbd key={idx}>{k}</kbd>)}
	</Fragment>;
};
