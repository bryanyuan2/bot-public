var Promise = require('promise'),
	webshot = require('webshot');

var screenshotModel = {};

var SCREENSHOT_CONF = {
		TARGET: {
			PROTOCOL: 'https',
			HOST: 'us.search.yahoo.com'
		},
		DEV: {
			PROTOCOL: 'https',
			HOST: 'bryanyuan2.tk',
			PORT: '443',
			SOURCE_FOLDER: 'public',
			SCREENSHOT_FOLDER: 'data'
		},
		// iphone 6 screen size: 320*568
		SCREEN_SIZE: {
		    width: 320,
		    height: 568
	  	},
	  	SHOT_SIZE: {
		    width: 320,
		    height: 'all'
	  	},
	  	QUALITY: 100,
	  	DIMENSION: {
	  		DESKTOP: {
	  			device: 'search?',
				tmpl: 'none',
				userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
	  		},
	  		TABLET: {
	  			device: 'tablet/s?',
				tmpl: 'none',
				userAgent: 'Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
	  		},
	  		MOBILE: {
	  			device: 'mobile/s?',
				tmpl: 'LONG02_M:UI2FBT2',
				userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
	  		}
	  	}
	};

screenshotModel._getUrl = function(data) {

	var conf = {};
		intl = (data.intl === 'us') ? '' : data.intl + '.';

	// device
	if (data.device === 'desktop') {
		conf = SCREENSHOT_CONF.DIMENSION.DESKTOP;
	} else if (data.device === 'tablet') {
		conf = SCREENSHOT_CONF.DIMENSION.TABLET;
	} else {
		conf = SCREENSHOT_CONF.DIMENSION.MOBILE;
	}

	var url = SCREENSHOT_CONF.TARGET.PROTOCOL + '://' + intl + SCREENSHOT_CONF.TARGET.HOST + '/' + conf.device + 'p=' + encodeURI(data.query) + '&tmpl=' + conf.tmpl;

	return url;
}

screenshotModel._getScreenshot = function(data) {

	var conf = {};
		intl = (data.intl === 'us') ? '' : data.intl + '.',
		timestamp = Math.round(+new Date()/1000),
		getQueryDash = data.query.replace(' ', '-');

	var conf = {
		URL: screenshotModel._getUrl(data) + '&__ip=72.229.28.185',
		LOCAL_SCREENSHOT_FOLDER: './' + SCREENSHOT_CONF.DEV.SOURCE_FOLDER + '/' + SCREENSHOT_CONF.DEV.SCREENSHOT_FOLDER + '/',
		LOCAL_FILENAME: getQueryDash + '_' + timestamp + '.jpg'
	};

	console.log("url = ", conf.URL);

	var options = {
	 	userAgent: conf.userAgent,
	 	screenSize: SCREENSHOT_CONF.SCREEN_SIZE,
	  	shotSize: SCREENSHOT_CONF.SHOT_SIZE,
	  	captureSelector: '.' + data.logid,
	  	quality: SCREENSHOT_CONF.QUALITY
	};

    return new Promise(function (resolve, reject) {
    	// screenshot_pref t0
    	var t0 = process.hrtime();

    	webshot(conf.URL, conf.LOCAL_SCREENSHOT_FOLDER + conf.LOCAL_FILENAME, options, function(err) {
		
		  if (err) {
		  	console.log("webshot err ", err);
		  }
		  // screenshot_pref t1
		  var screenshot_pref = process.hrtime(t0);

		  resolve({
	  		query: data.query,
		  	logid: data.logid,
		  	timestamp: timestamp,
		  	screenshot_pref: (screenshot_pref[0] * 1e9 + screenshot_pref[1])/1000000000,
		  	screenshot: SCREENSHOT_CONF.DEV.PROTOCOL + '://' +  SCREENSHOT_CONF.DEV.HOST + ':' + SCREENSHOT_CONF.DEV.PORT + '/' + SCREENSHOT_CONF.DEV.SCREENSHOT_FOLDER + '/' + conf.LOCAL_FILENAME,
		  	conf: conf,
		  	res: data.res
		  });		  
		});
	});
}

module.exports = screenshotModel;
