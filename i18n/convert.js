const po2json = require('po2json');
const fs = require('fs');

function simplifyJson(jsonData) {
	const json = {};
	Object.keys(jsonData).forEach((key) => {
		// Special headers handling, we do not need everything
		if ('' === key) {
			json[''] = {
				'language': jsonData['']['language'],
				'plural-forms': jsonData['']['plural-forms'],
			};
		} else {
			// Do not dump untranslated keys, they already are in the templates!
			if ('' !== jsonData[key][1])
				json[key] = 2 === jsonData[key].length ? jsonData[key][1] : jsonData[key].slice(1);
		}
	});
	return json;
}

function saveToJson(json, file) {
	return new Promise((resolve, reject) => {
		fs.writeFile(file, JSON.stringify(json, null, 2), function(err) {
			if (err)
				reject(err);
			else
				resolve();
		});
	});
}

function convertFile(lang) {
	const jsonData = po2json.parseFileSync(`./i18n/messages.${lang}.po`);
	const json = simplifyJson(jsonData);
	return saveToJson(json, `./src/i18n/messages.${lang}.json`);
}

function _convertFile(lang) {
	return () => {
		return convertFile(lang);
	};
}

function _complete() {
	console.log('Messages conversion complete');
}

convertFile('ru')
	.then(_complete);


