import type { FunctionalComponent } from 'preact';
import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
// @ts-ignore
import worker from './Metronome.worker.js';
import tick from './tick.wav';

const NOTE_LENGTH = 0.05;
const NOTE_FREQ = 340;
const FADE_IN = 0.01;
const FADE_OUT = 0.01;
const OSC_TYPE = 'sine';

function _playNote(context: AudioContext) {
	const o = context.createOscillator();
	const g = context.createGain();
	o.type = OSC_TYPE;
	o.connect(g);
	g.connect(context.destination);
	const t = context.currentTime;
	o.frequency.setTargetAtTime(NOTE_FREQ, t, FADE_IN);
	g.gain.setTargetAtTime(1, t, FADE_OUT);
	g.gain.setTargetAtTime(0, t + NOTE_LENGTH - 2 * FADE_OUT, FADE_OUT);
	o.start(t);
	o.stop(t + NOTE_LENGTH);
}

export interface IMetronomeProps {
	bpm: number;
}

export const Metronome: FunctionalComponent<IMetronomeProps> = ({ bpm }) => {
	const [timeWorker] = useState<Worker>(new Worker(worker));
	const play = useRef<() => void>();

	useEffect(() => {
		const context = new AudioContext();
		play.current = () => {
			_playNote(context);
		};
		return () => {
			context.close();
		}
	}, []);

	useEffect(() => {
		const ms = bpm > 0 ? 60000.0 / bpm : 0;

		timeWorker.onmessage = (e) => {
			if (e.data === 'tick') {
				if (play.current) {
					play.current();
				}
			} else {
				console.log('message:', e.data);
			}
		};

		timeWorker.postMessage({ interval: ms });
	}, [timeWorker, bpm]);
	useEffect(() => {
		timeWorker.postMessage('start');
		return () => {
			timeWorker.postMessage('stop');
		}
	}, [bpm]);
	return null;
};
