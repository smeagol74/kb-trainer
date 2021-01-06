import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
// @ts-ignore
import worker from './Metronome.worker.js';

import jsLogger from 'js-logger';

const log = jsLogger.get('Metronome');

const NOTE_LENGTH = 0.05;
const NOTE_FREQ = 340;
const FADE_IN = 0.01;
const FADE_OUT = 0.01;
const OSC_TYPE = 'sine';

const AudioContext = window.AudioContext || window.webkitAudioContext;

function _playNote(context: AudioContext, volume: number) {
	const o = context.createOscillator();
	const g = context.createGain();
	o.type = OSC_TYPE;
	o.connect(g);
	g.connect(context.destination);
	const t = context.currentTime;
	o.frequency.setTargetAtTime(NOTE_FREQ, t, FADE_IN);
	g.gain.value = volume;
	g.gain.setTargetAtTime(volume, t, FADE_OUT);
	g.gain.setTargetAtTime(0, t + NOTE_LENGTH - 2 * FADE_OUT, FADE_OUT);
	o.start(t);
	o.stop(t + NOTE_LENGTH);
}

export interface IMetronomeProps {
	bpm: number;
	volume: number;
}

export const Metronome: FunctionalComponent<IMetronomeProps> = ({ bpm, volume }) => {
	const [timeWorker, setTimeWorker] = useState<Worker | undefined>(undefined);
	const play = useRef<() => void>();

	useEffect(() => {
		const context = new AudioContext();
		play.current = () => {
			_playNote(context, volume);
		};
		return () => {
			context.close();
		};
	}, []);

	useEffect(() => {
		const ms = bpm > 0 ? 60000.0 / bpm : 0;
		if (timeWorker) {
			timeWorker.postMessage({ interval: ms });
		}
	}, [timeWorker, bpm]);
	useEffect(() => {
		const wk = new Worker(worker);
		wk.postMessage('start');
		wk.onmessage = (e) => {
			if (e.data === 'tick') {
				if (play.current) {
					play.current();
				}
			} else {
				log.debug('message:', e.data);
			}
		};
		setTimeWorker(wk);
		return () => {
			wk.postMessage('stop');
			wk.terminate();
			setTimeWorker(undefined);
		};
	}, []);
	return null;
};
