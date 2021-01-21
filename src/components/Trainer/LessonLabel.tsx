import { Fragment, FunctionalComponent, h } from 'preact';
import { Icon } from '../Icon/Icon';
import _ from 'lodash';
import { useContext } from 'preact/hooks';
import { i18nContext } from '../../App';
import { keyName } from '../../utils/keyboard';

export interface ILessonLabelProps {
	keyboard: string;
	lesson: string[];
	lessonNumber: number;
	lessonsIncomplete: boolean;
}

export const LessonLabel: FunctionalComponent<ILessonLabelProps> = ({
																																			keyboard,
																																			lesson,
																																			lessonNumber,
																																			lessonsIncomplete,
																																		}) => {
	const { _p } = useContext(i18nContext);

	return <Fragment>
		<Icon img="keyboard-4" size="lg" /> {keyboard}
		{lessonsIncomplete && <Fragment> – <Icon img="education-1" size="lg" />
			{_p('LessonLabel', 'Lesson %1.', lessonNumber)}
			{_.map(lesson, (k, idx) => <kbd key={idx}>{keyName(k)}</kbd>)}
		</Fragment>}
	</Fragment>;
};

