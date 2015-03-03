/**
 * Created by laury.lu on 2015/3/3.
 */
define(function (require, exports, module) {

    var _ = require('_');
    var notification = require('notification');
    var utils = require('utils')
    var rss = require('rss')
    var isStarted = false;
    var intervalId = -1;
    var mInterval = 20*1000

    function loopCall(){
        console.log('fetch rss.....')
        rss
            .query()
            .then(function (infoArr) {
                var latest = infoArr.sort()[0]
                return notification
                    .create(latest)

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
        loopCall();
        isStarted = true;
        intervalId = setInterval(loopCall,mInterval )
    }


    module.exports = {
        stop: stop,
        start: start
    }


})
