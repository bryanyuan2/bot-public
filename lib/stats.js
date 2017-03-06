var Promise = require('promise');

var mobstorModel = require('./mobstor'),
	screenshotModel = require('./screenshot'),
	wlQueryModel = require('./whitelist-query');

var statsModel = {};

// [dev] stats for average time of execuation
statsModel._getStats = function(data) {
	var counter = 0,
		getLimit = data.limit;

	// pref t0
    var t0 = process.hrtime();

    return new Promise(function (resolve, reject) {
		for (var i =0;i<getLimit;i++) {
			wlQueryModel._getWhiteList(data)
						.then(screenshotModel._getScreenshot)
						.then(mobstorModel._push2Mobstor)
						.then(function(data) {
							counter = counter + 1;
							if (counter == getLimit) {
								// pref t1
						  		var pref = process.hrtime(t0);
								resolve({
							    	total: (pref[0] * 1e9 + pref[1])/1000000000,
									avg: ((pref[0] * 1e9 + pref[1])/1000000000)/getLimit
							    });
							}
						});
		}
	});
}

module.exports = statsModel;
