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
    var mInterval = 30*60*1000

    function loopCall(){
        console.log('fetch rss.....')
        rss
          .query()
          .then(function (infoArr) {
              var latest = infoArr.sort()[0]
              notification
                .create(latest)
                .then(function () {
                    //callback after notification created

                })
          },function(){
              console.log('bangumi already notified..........')
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
