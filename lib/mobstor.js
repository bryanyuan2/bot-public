var Promise = require('promise'),
	fs = require('fs');

var mobstorModel = {};

mobstorModel._push2Mobstor = function(data) {
	return new Promise(function (resolve, reject) {
	    resolve(data);   
	  });
}

module.exports = mobstorModel;
