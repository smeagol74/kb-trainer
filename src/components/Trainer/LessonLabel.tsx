import { Fragment, FunctionalComponent } from 'preact';
import type { KeyboardLesson } from '../Db/Keyboard';
import { h } from 'preact';
import { Icon } from '../Icon/Icon';
import _ from 'lodash';
import { FCaption } from '../Db/Keyboard';

export interface ILessonLabelProps {
	keyboard: string;
	lesson: KeyboardLesson;
	lessonNumber: number;
}

export const LessonLabel: FunctionalComponent<ILessonLabelProps> = ({keyboard, lesson, lessonNumber}) => {
	return <Fragment>
		<Icon img="keyboard-4" size="lg" /> {keyboard} – <Icon img="education-1" size="lg" /> Lesson {lessonNumber}.
		{_.map(lesson.keys, (k, idx) => <kbd key={idx}>{k}</kbd>)}
		<i>({FCaption[lesson.finger]})</i>
	</Fragment>
}
