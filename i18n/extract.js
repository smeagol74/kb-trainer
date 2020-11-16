const { GettextExtractor, JsExtractors } = require('gettext-extractor');

let extractor = new GettextExtractor();

extractor
	.createJsParser([
		JsExtractors.callExpression('__', {
			arguments: {
				text: 0,
			},
		}),
		JsExtractors.callExpression('_n', {
			arguments: {
				text: 0,
				textPlural: 1,
			},
		}),
		JsExtractors.callExpression('_p', {
			arguments: {
				context: 0,
				text: 1,
			},
		}),
		JsExtractors.callExpression('_np', {
			arguments: {
				context: 0,
				text: 1,
				textPlural: 2,
			},
		}),
	])
	.parseFilesGlob('./src/**/*.@(ts|js|tsx|jsx)');

extractor
	.savePotFile('./i18n/messages.pot');

extractor
	.printStats();
