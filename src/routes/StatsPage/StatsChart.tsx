import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import type { ChartData } from 'chart.js';
import './StatsChart.scss';
import jsLogger from 'js-logger';
import type { pgettextFunc } from '../../utils/gettext';
import { useContext } from 'preact/hooks';
import { i18nContext } from '../../App';
import { Chart } from '../../components/Chart/Chart';
import _ from 'lodash';

const log = jsLogger.get('StatsChart');


export interface IStatsChartProps {
	strokes: Dict<number>,
	errors: Dict<number>
}

function _mkTotalData(strokes: Dict<number>, _p: pgettextFunc): ChartData {
	const keys: string[] = [];
	const values: number[] = [];
	_.each(strokes, (v, k) => {
		keys.push(k);
		values.push(v);
	});
	return {
		labels: keys,
		datasets: [
			{
				label: _p('StatsChart', 'Strokes'),
				backgroundColor: 'rgba(179,181,198,0.2)',
				borderColor: 'rgba(179,181,198,1)',
				pointBackgroundColor: 'rgba(179,181,198,1)',
				pointBorderColor: '#fff',
				pointHoverBackgroundColor: '#fff',
				pointHoverBorderColor: 'rgba(179,181,198,1)',
				data: values,
			},
		],
	};
}

function _mkErrorsData(errors: Dict<number>, _p: pgettextFunc): ChartData {
	const keys: string[] = [];
	const values: number[] = [];
	_.each(errors, (v, k) => {
		keys.push(k);
		values.push(v);
	});
	return {
		labels: keys,
		datasets: [
			{
				label: _p('StatsChart', 'Errors'),
				backgroundColor: 'rgba(179,181,198,0.2)',
				borderColor: 'rgba(179,181,198,1)',
				pointBackgroundColor: 'rgba(179,181,198,1)',
				pointBorderColor: '#fff',
				pointHoverBackgroundColor: '#fff',
				pointHoverBorderColor: 'rgba(179,181,198,1)',
				data: values,
			},
		],
	};
}

export const StatsChart: FunctionalComponent<IStatsChartProps> = ({ strokes, errors }) => {

	const { _p } = useContext(i18nContext);

	const hasErrors = _(errors).values().sum() > 0;

	return <div className="StatsChart">
		<div className="StatsChart__chart">
			<Chart {...{
				width: 600,
				height: 600,
				config: {
					type: 'radar',
					data: _mkTotalData(strokes, _p),
					options: {
						title: {
							text: _p('StatsChart', 'Strokes'),
							display: true,
						},
						legend: {
							display: false,
							position: 'bottom',
							labels: {
								fontColor: '#fff',
							},
						},
						scale: {
							gridLines: {
								color: '#aaa',
							},
							pointLabels: {
								fontColor: '#fff',
							},
							angleLines: {
								color: '#aaa',
							},
							ticks: {
								min: 0,
								backdropColor: '#000',
								fontColor: '#aaa',
							},
						},
					},
				},
			}} />
			{hasErrors && <Chart {...{
				width: 600,
				height: 600,
				config: {
					type: 'radar',
					data: _mkErrorsData(errors, _p),
					options: {
						title: {
							text: _p('StatsChart', 'Errors'),
							display: true,
						},
						legend: {
							display: false,
							position: 'bottom',
							labels: {
								fontColor: '#fff',
							},
						},
						scale: {
							gridLines: {
								color: '#aaa',
							},
							pointLabels: {
								fontColor: '#fff',
							},
							angleLines: {
								color: '#aaa',
							},
							ticks: {
								min: 0,
								backdropColor: '#000',
								fontColor: '#aaa',
							},
						},
					},
				},
			}} />}
		</div>
	</div>;
};
