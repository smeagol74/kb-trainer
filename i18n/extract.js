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

const { exec } = require('child_process');

function merge(lang) {
	return function() {
		console.log(`Merging messages.${lang}.po with messages.pot`);
		return new Promise((resolve, reject) => {
			exec(`msgmerge --update ./i18n/messages.${lang}.po ./i18n/messages.pot`, (error, stdout, stderr) => {
				console.log(stdout);
				if (error) {
					console.log('Error:', error);
					reject();
				} else {
					console.log('Success');
					resolve();
				}
			});
		});
	};
}

merge('ru')()
	.then(() => console.log('Done'));

