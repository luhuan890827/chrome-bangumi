/**
 * Created by laury.lu on 2015/3/3.
 */
define(function (require, exports, module) {
    //checkout permissons
    var _ = require('_');
    var notification = require('notification');
    var utils = require('utils')
    var rss = require('rss')
    var isStarted = false;
    var intervalId = -1;
    var mInterval = 20*1000
    var _runtime = chrome.runtime
    function syncRss(){
        console.log('fetch rss.....')
        rss
            .query()
            .then(function (infoArr) {
                var latest = infoArr.sort()[0]
                return notification
                    .createOrShow(latest)

            })
            .then(function (itemData) {
                //after notification show
            })
            .catch(function(){
                console.error(arguments)
            })
    }
    function stop() {
        clearInterval(intervalId)
    }

    function start() {
        syncRss();
        isStarted = true;
        intervalId = setInterval(syncRss,mInterval )
    }

    _runtime.onMessage.addListener(function (req,sender,sendResp) {
        console.log(req);
        console.log(sender);
        console.log(sendResp)
    })

    module.exports = {
        stop: stop,
        start: start
    }


})
