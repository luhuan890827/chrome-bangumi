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
    function syncRss(reshow){
        console.log('fetch rss.....')
        return rss
            .query()
            .then(function (infoArr) {
                var latest = infoArr.sort()[0]
                return notification
                    .createOrShow(latest,reshow)

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
        intervalId = setInterval(_.partial(syncRss,false),mInterval )
    }

    _runtime.onMessage.addListener(function (req,sender,sendResp) {
        if(req.action==="sync"){
            //should notified all unchecked?
            syncRss(true).then(function(){
                sendResp({
                    action:utils.const.DONE
                })
            });
            return true;
        }
        console.log(req);
        console.log(sender);
        console.log(sendResp)
    })

    module.exports = {
        stop: stop,
        start: start
    }


})
