import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import type { ChartConfiguration } from 'chart.js';
import ChartJs from 'chart.js';

export interface IChartProps {
	width?: number;
	height?: number;
	id?: string;
	getDatasetAtEvent?: (event: MouseEvent, data?: {}[]) => void;
	getElementsAtEvent?: (event: MouseEvent, data?: {}[]) => void;
	getElementAtEvent?: (event: MouseEvent, data?: {}[]) => void;
	config: ChartConfiguration;
}

export const Chart: FunctionalComponent<IChartProps> = ({ id, width, height, getDatasetAtEvent, getElementAtEvent, getElementsAtEvent, config }) => {

	const ref = useRef<HTMLCanvasElement>();
	const [chart, setChart] = useState<ChartJs | undefined>(undefined);

	useEffect(() => {
		if (ref.current && setChart) {
			const instance = new ChartJs(ref.current, config);
			setChart(instance);

			return () => {
				instance.destroy();
			};
		}
	}, [ref.current, setChart]);

	function handleOnClick(event: MouseEvent) {
		getDatasetAtEvent?.(event, chart?.getDatasetAtEvent(event));
		getElementAtEvent?.(event, chart?.getElementAtEvent(event));
		getElementsAtEvent?.(event, chart?.getElementsAtEvent(event));
	}

	return (
		<canvas
			ref={ref}
			height={height}
			width={width}
			id={id}
			onClick={handleOnClick}
		/>
	);
};

