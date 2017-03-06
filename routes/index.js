'use strict';

var indexModel = {};

indexModel.getMsg = function(req, res) {
  res.json({
    message: 'DD bot'
  });
};

module.exports = indexModel;
