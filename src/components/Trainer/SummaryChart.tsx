import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import { Chart } from '../Chart/Chart';
import type { ChartData } from 'chart.js';
import type { ISummaryData } from './StudyCourse';
import './SummaryChart.scss';
import jsLogger from 'js-logger';

const log = jsLogger.get('SummaryChart');


export interface ISummaryChartProps {
	data: ISummaryData;
}

function _mkTotalData(data: ISummaryData): ChartData {
	return {
		labels: data.keys,
		datasets: [
			{
				label: 'Strokes',
				backgroundColor: 'rgba(179,181,198,0.2)',
				borderColor: 'rgba(179,181,198,1)',
				pointBackgroundColor: 'rgba(179,181,198,1)',
				pointBorderColor: '#fff',
				pointHoverBackgroundColor: '#fff',
				pointHoverBorderColor: 'rgba(179,181,198,1)',
				data: data.total.strokes,
			},
		],
	};
}

function _mkLessonData(data: ISummaryData): ChartData {
	return {
		labels: data.keys,
		datasets: [
			{
				label: 'Strokes',
				backgroundColor: 'rgba(179,181,198,0.2)',
				borderColor: 'rgba(179,181,198,1)',
				pointBackgroundColor: 'rgba(179,181,198,1)',
				pointBorderColor: '#fff',
				pointHoverBackgroundColor: '#fff',
				pointHoverBorderColor: 'rgba(179,181,198,1)',
				data: data.lesson!.strokes,
			},
			{
				label: 'Errors',
				backgroundColor: 'rgba(255,99,132,0.2)',
				borderColor: 'rgba(255,99,132,1)',
				pointBackgroundColor: 'rgba(255,99,132,1)',
				pointBorderColor: '#fff',
				pointHoverBackgroundColor: '#fff',
				pointHoverBorderColor: 'rgba(255,99,132,1)',
				data: data.lesson!.errors,
			},
		],
	};
}

export const SummaryChart: FunctionalComponent<ISummaryChartProps> = ({ data }) => {

	log.debug(data);

	return <div className="SummaryChart">
		<div className="SummaryChart__chart">
			<Chart {...{
				width: 300,
				height: 300,
				config: {
					type: 'radar',
					data: _mkTotalData(data),
					options: {
						title: {
							text: 'Total',
							display: true,
						},
						legend: {
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
		</div>
		{data.lesson && <div className="SummaryChart__chart">
			<Chart {...{
				width: 300,
				height: 300,
				config: {
					type: 'radar',
					data: _mkLessonData(data),
					options: {
						title: {
							text: 'Last session',
							display: true,
						},
						legend: {
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
		</div>}
	</div>;
};
