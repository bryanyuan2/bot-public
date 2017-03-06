var Promise = require("promise"),
    request = require("request"),
    CHANNEL_TOKEN = process.env.LINEAPI_CHANNEL_TOKEN,
    LINE_REPLY_URL = "https://api.line.me/v2/bot/message/reply",
    HOST_QUERY_URL = "https://bryanyuan2.tk/v1/query?query=";

var mobstorModel = require('./../lib/mobstor'),
    screenshotModel = require('./../lib/screenshot'),
    wlQueryModel = require('./../lib/whitelist-query'),
    wlSelectorModel = require('./../lib/whitelist-selector'),
    statsModel = require('./../lib/stats');

var hookModel = {};

var replyToLine = function (token, msg, dataObj) {
    var headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + CHANNEL_TOKEN
        };

    var replyObj = {
        "replyToken": token,
        "messages": [{ "type": "text", "text": "Hello, world!" }]
    };
    console.log("=== reply to bot");
    console.log("dataObj", dataObj);

    if (dataObj.logid != null) {
        replyObj.messages = [{
            "type": "image",
            "originalContentUrl": dataObj.screenshot,
            "previewImageUrl": dataObj.screenshot
        }];
    } else {
        replyObj.messages = [{ "type": "text", "text": "阿鬼你還是說中文吧" }];
    }

    console.log("Final data........");
    console.log(replyObj);

    request({
        url: LINE_REPLY_URL, 
        headers: headers,
        method: "POST",
        body: JSON.stringify(replyObj)
    }, function (error, response, body) {
        if (error) {
            console.log("From Line Error sending message: ", error);
        } else if (response.body.error) {
            console.log("From Line Error: ", response.body.error);
        }
        console.log("From Line send response: ", response.body);
    });
};

var parseMsg = function (token, msg, replyToBot) {
    console.log(HOST_QUERY_URL + msg);
    request(HOST_QUERY_URL + msg, function (error, response, body) {
        if (error) {
            console.log("From Host Error sending message: ", error);
        } else if (response.body.error) {
            console.log("From Host Error: ", response.body.error);
        }
        console.log("From Host send response: ", response.body);
        var dataObj = JSON.parse(response.body);
        console.log("parseMsg completed");
        replyToBot(token, msg, dataObj);
    });     
}

var hook = function (req, res, replyToBot) {
    var events = req.body.events || [];
    // received message sample
    // var events = [{
    //     "replyToken": "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
    //     "type": "message",
    //     "timestamp": 1462629479859,
    //     "source": {
    //          "type": "user",
    //          "userId": "U206d25c2ea6bd87c17655609a1c37cb8"
    //      },
    //      "message": {
    //          "id": "325708",
    //          "type": "text",
    //          "text": "Hello, world"
    //       }
    //   }];
    for (var i = 0; i < events.length; i++) {
        var token = events[i].replyToken,
            userId = events[i].source.userId,
            msg = events[i].message.type=="text" ? events[i].message.text : "";
        if (msg) {
            parseMsg(token, encodeURIComponent(msg), replyToBot);
        }
    }

    res.setHeader("Content-Type", "application/json");
    res.send(req.path);
};

hookModel.hookOnLine = function(req, res) {
    hook(req, res, replyToLine);
}

hookModel.hookOnFB = function(req, res) {
    hook(req, res, replyToFB);
}
module.exports = hookModel;