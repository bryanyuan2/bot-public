var Promise = require('promise');

var wlQueryModel = {};

var CONF_WHITELIST = {
	dict: {
		query: ["define"],
		//selector: "DctnryCard",
		selector: "sys_dictionary",
		type: "screenshot"
	},
	weather: {
		query: ["weather"],
		selector: "compWeatherImage",
		type: "screenshot"
	}
};

wlQueryModel._getWhiteList = function(data) {
	var query = data.query,
		matchSelector = null,
		responseType = null,
		content = null;

	return new Promise(function (resolve, reject) {
		for (var i in CONF_WHITELIST) {
			for (var kw in CONF_WHITELIST[i].query) {
				if (query.toLowerCase().indexOf(CONF_WHITELIST[i].query[kw]) != "-1") {
					matchSelector = CONF_WHITELIST[i].selector;
					responseType = CONF_WHITELIST[i].type;
					content = CONF_WHITELIST[i].content;
				}
			}
		}

		resolve({
			intl: data.intl,
	  		device: data.device,
		  	query: data.query,
		  	logid: matchSelector,
		  	res: data.res,
		  	type: responseType,
		  	content: content
		 });
	});
}


module.exports = wlQueryModel;