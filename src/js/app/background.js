/**
 * Created by laury.lu on 2015/2/27.
 */
(function () {
    'use strict'
    var confObj = getConf();
    var latestItem
    var getNotificationId =(function (){
        var _id=0;
        return function(){
            _id++;
            return _id+'';
        }
    })()

    setInterval(function () {

        queryJob()
          .then(function (allInf) {

              return allInf.sort(function (a, b) {

              })[0]
          })
          .then(function (latestRes) {
              if(!latestItem||latestItem.title!==latestRes.title){
                  latestItem = latestRes;
                  makeNotification(latestRes).then(function(){})
              }

          })
    }, confObj.mInterval)
    function queryJob() {
        var url = String.format('http://share.dmhy.org/topics/rss/{0}/{1}/{2}/rss.xml', '', '', '')
        return fetch(url)
          .then(function (resp) {
              return resp.text();
          })
          .then(function (textData) {
              //
              var parser = new DOMParser();
              var _doc = parser.parseFromString(textData, "application/xml");
              var items = _doc.getElementsByTagName('item');
              var bangumiInfo = [];
              [].forEach.call(items, function (aNode, index) {
                  var obj = parseItem(aNode);
                  bangumiInfo.push(obj)

              })
              return bangumiInfo
          })
    }

    function getConf() {
        var confObj = JSON.parse(localStorage.getItem('conf')) || {};
        if (Object.keys(confObj).length == 0) {
            confObj.mInterval = 10000
            //var mInterval = 60*60*1000
            confObj.recent = 1;
            confObj.sortId = -1;
            confObj.keyword = '';
            localStorage.setItem('conf', JSON.stringify(confObj))
        }

        return confObj
    }
    //todo preload image before notification
    function makeNotification(itemData) {

        return new Promise(function (resolve, reject) {
            //todo????
            var img = new Image();
            var timeoutId = setTimeout(function(){
                resolve('resources/icon.png')
            },4000)
            img.onload = function () {
                console.log('###################')
                clearTimeout(timeoutId)
                resolve(itemData.gImage)
            }

            //img.src = itemData.gImage

        }).then(function (imgUrl) {
              return new Promise(function (resolve, reject) {
                  chrome.notifications.create(getNotificationId(), {
                      type: "basic",
                      title: itemData.title,
                      message: "Primary message to display",
                      //iconUrl: itemData.gImage
                      iconUrl: imgUrl
                  }, function () {
                      resolve(itemData);
                  });
              })
          })
    }

    function parseItem(mNode) {
        var obj = {};
        obj.title = mNode.getElementsByTagName('title')[0].childNodes[0].textContent;
        obj.link = mNode.getElementsByTagName('link')[0].textContent;
        obj.pubDate = new Date(mNode.getElementsByTagName('pubDate')[0].textContent)
        obj.magnet = mNode.getElementsByTagName('enclosure')[0].attributes[0].value;
        var desc = mNode.getElementsByTagName('description')[0].childNodes[0].textContent
        //todo 这里会尝试获取图片，最好换一种方式
        var $ele = $(desc);
        obj.gImage = $ele.find('img').attr('src');
        return obj
    }

    String.format = function () {
        var param = [];
        for (var i = 0, l = arguments.length; i < l; i++) {
            param.push(arguments[i]);
        }
        var statment = param[0]; // get the first element(the original statement)
        param.shift(); // remove the first element from array
        return statment.replace(/\{(\d+)\}/g, function (m, n) {
            return param[n];
        });
    }
})()


