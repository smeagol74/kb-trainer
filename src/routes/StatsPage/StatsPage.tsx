import clsx from 'clsx';
import type { FunctionComponent } from 'preact';
import { h } from 'preact';

interface IStatsPageProps {
	className?: string;
}

export const StatsPage: FunctionComponent<IStatsPageProps> = ({ className }) => {

	return <div className={clsx('StatsPage', className)}>


	</div>;
};
