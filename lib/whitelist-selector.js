var Promise = require('promise'),
	jsdom = require('jsdom');

var screenshotModel = require('./screenshot');
var jquery = 'http://code.jquery.com/jquery.js';

var wlSelectorModel = {};

var CONF_SELECTOR_CARD = {
	//WthrCrd: '.WthrCrd',
	WthrCrd: '.compWeatherImage',
	NewsCard: '.NewsCard',
	FamousPeopleCard: '.FamousPeopleCard',
	SportsPlayerCard: '.SportsPlayerCard',
	SportsteamCard: '.SportsteamCard',
	ActorCard: '.ActorCard',
	MusicArtistCard: '.MusicArtistCard',
	ZipcodesCard: '.ZipcodesCard',
	ttryCard: '.ttryCard',
	MovieCard: '.MovieCard',
	FinanceCard: '.FinanceCard',
	SportsLgSc: '.SportsLgSc',
	TvSeriesCard: '.TvSeriesCard',
	Q2aCard: '.Q2aCard',
	ElectionPolls: '.ElectionPolls',
	Q2aCard: '.Q2aCard',
	DctnryCard: '.DctnryCard'
};

wlSelectorModel._getExistedCard = function(data) {
	var dds = [];
	// findselector_pref t0
    var t0 = process.hrtime();
    return new Promise(function (resolve, reject) {
		jsdom.env(screenshotModel._getUrl(data), [jquery], {
		  	done: function (err, window) {
		  		var $ = window.$;
			    for (i in CONF_SELECTOR_CARD) {
			    	// check if dom is existed
			    	if ($(CONF_SELECTOR_CARD[i]).length) {
			    		dds.push(i);
				    }
			    }

			    // findselector_pref t1
		  		var findselector_pref = process.hrtime(t0);

			    resolve({
			    	selectors: dds,
			    	pref: (findselector_pref[0] * 1e9 + findselector_pref[1])/1000000000
			    });
			 }
		});		
	});
}


module.exports = wlSelectorModel;