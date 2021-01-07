import _ from 'lodash';

export enum Category {
	LanguageSwitch = 'Language Switch',
	ExternalLink = 'External Link'
}

export enum Action {
	ChangeTo = 'Change To',
	NavigateTo = 'Navigate To'
}

export interface Analytics {
	trackEvent: (category: Category, action: Action, name?: string, value?: number) => void;
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

