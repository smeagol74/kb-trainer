import _ from 'lodash';

export enum Category {
	LanguageSwitch = 'Language Switch',
}

export const Action = {
	changeTo: (lang: string) => `Change to ${lang}`,
};

export interface Analytics {
	trackEvent: (category: Category, action: string, name?: string, value?: number) => void;
}

export const analytics: Analytics = {
	trackEvent: () => {
	},
};

if (!_.isNil(window._paq)) {
	analytics.trackEvent = (category, action, name, value) => {
		const event: any[] = ['trackEvent', category, action];
		if (!_.isNil(name)) {
			event.push(name);
		} else if (!_.isNil(value)) {
			event.push('');
		}
		if (!_.isNil(value)) {
			event.push(value);
		}
		window._paq!.push(event);
	};
}

