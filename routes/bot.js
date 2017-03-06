var mobstorModel = require('./../lib/mobstor'),
	screenshotModel = require('./../lib/screenshot'),
	wlQueryModel = require('./../lib/whitelist-query'),
	wlSelectorModel = require('./../lib/whitelist-selector'),
	statsModel = require('./../lib/stats'),
	botModel = {};

/**
 * @api {get} /bot
 * @apiName 
 *
 * @apiParam {String} query
 * @apiParam {String} logid
 * @apiParam {String} device (desktop, mobile)
 *
 * @apiSuccess {String} query
 * @apiSuccess {String} logid
 * @apiSuccess {Timestamp} timestamp
 * @apiSuccess {Float} screenshot_pref
 * @apiSuccess {String} screenshot
 * @apiSuccess {String} mobstor
 */
botModel.init = function(req, res) {
	var data = {
		intl: req.query.intl || 'us',
		query: req.query.query || 'sunnyvale weather',
		logid: req.query.logid || 'compWeatherImage',
		device: req.query.device || 'mobile',
		res: res
	};

	screenshotModel._getScreenshot(data)
				   //.then(mobstorModel._push2Mobstor)
				   .then(function(data) {
						var output = data.res;
						output.send({
							query: data.query,
							logid: data.logid,
							device: data.device,
							timestamp: data.timestamp,
							screenshot_pref: data.screenshot_pref,
							mobstor_pref: data.mobstor_pref,
							screenshot: data.screenshot,
							mobstor: data.mobstor,
							status: data.status
						});
			    		console.log('done');
					});
}


/**
 * @api {get} /query
 * @apiName screenshot with whitelist query
 *
 * @apiParam {String} intl
 * @apiParam {String} query
 * @apiParam {String} logid/selector
 * @apiParam {String} device
 *
 * @apiSuccess {String} intl
 * @apiSuccess {String} query
 * @apiSuccess {String} logid
 * @apiSuccess {String} device
 * @apiSuccess {Timestamp} timestamp
 * @apiSuccess {Float} screenshot_pref
 * @apiSuccess {Float} mobstor_pref
 * @apiSuccess {String} screenshot
 * @apiSuccess {String} mobstor
 */
botModel.query = function(req, res) {
	var data = {
		intl: req.query.intl || 'us',
		query: req.query.query || 'sunnyvale weather',
		logid: req.query.logid || 'compWeatherImage',
		device: req.query.device || 'mobile',
		res: res
	};

	wlQueryModel._getWhiteList(data)
				.then(screenshotModel._getScreenshot)
				.then(mobstorModel._push2Mobstor)
				.then(function(data) {
					var output = data.res;
					output.send({
						intl: data.intl,
						query: data.query,
						logid: data.logid,
						device: data.device,
						timestamp: data.timestamp,
						screenshot_pref: data.screenshot_pref,
						mobstor_pref: data.mobstor_pref,
						screenshot: data.screenshot,
						mobstor: data.mobstor,
						//type: data.type,
						//content: data.content
					});
				    console.log('done');
				});
}

/**
 * @api {get} /find
 * @apiName return list of DD selector on page
 *
 * @apiParam {String} intl
 * @apiParam {String} query
 * @apiParam {String} device
 *
 * @apiSuccess {String} intl
 * @apiSuccess {String} query
 * @apiSuccess {String} device
 * @apiSuccess {Timestamp} timestamp
 * @apiSuccess {Array} selector
 * @apiSuccess {Float} pref
 */
botModel.find = function(req, res) {
	var output = res,
		timestamp = Math.round(+new Date()/1000),
		data = {
			intl: req.query.intl || 'us',
			query: req.query.query || 'sunnyvale weather',
			device: req.query.device || 'mobile',
			res: res
		};

	wlSelectorModel._getExistedCard(data)
				   .then(function(results){
						output.send({
							intl: data.intl,
							query: data.query,
							device: data.device,
							timestamp: timestamp,
							selectors: results.selectors,
							pref: results.pref
						});
				   });
}


/**
 * @api {get} /stats
 * @apiName return stats for average time of execuation
 *
 * @apiParam {String} intl
 * @apiParam {String} query
 * @apiParam {String} logid/selector
 * @apiParam {String} device
 * @apiParam {Number} limit
 *
 * @apiSuccess {Float} total
 * @apiSuccess {Float} avg
 */
botModel.stats = function(req, res) {

	var data = {
			intl: req.query.intl || 'us',
			query: req.query.query || 'sunnyvale weather',
			logid: req.query.logid || 'compWeatherImage',
			device: req.query.device || 'mobile',
			limit: req.query.limit || '10',
			res: res
		},
		output = res;

	statsModel._getStats(data).then(function(result){
		output.send(result);
	});
}

module.exports = botModel;
