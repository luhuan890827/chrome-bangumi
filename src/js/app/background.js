/**
 * Created by laury.lu on 2015/2/27.
 */
(function () {
    //todo 把notification相关功能移至notifications.js文件
    'use strict'
    var manifest = chrome.runtime.getManifest();
    var _port = {}
    var confObj = getConf();
    var imgReg = /<img.+src="(.+)\.(jpg|png|jpeg|gif)".+>/i
    var latestItem
    var notifiedItems = {}
    var notificationButtons = [
        {title: "查看发布页"},
        {title: "复制磁力链"}
    ]
    var getNotificationId = (function () {
        var _id = 0;
        return function () {
            _id++;
            return _id + '';
        }
    })()

    var intervalId = setInterval(function () {

        queryJob()
          .then(function (allInf) {

              return allInf.sort(function (a, b) {

              })[0]
          })
          .then(function (latestRes) {
              //if (!latestItem || latestItem.title !== latestRes.title) {
              latestItem = latestRes;
              makeNotification(latestRes).then(function () {
              })
              //}

          })
    }, confObj.mInterval)

    chrome.notifications.onButtonClicked.addListener(onNotificationButtonClick);

    function onNotificationButtonClick(notificationId, buttonIndex) {
        var bangumiData = notifiedItems[notificationId + '']
        if (buttonIndex === 0) {
            //查看发布页面
            window.open(bangumiData.link)
        }
        if (buttonIndex === 1) {
            //复制磁力链接
            clipTextToClipBoard(bangumiData.magnet)
        }

    }

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

    function clipTextToClipBoard(str /*,mimetype*/) {
        document.oncopy = function (event) {
            //event.clipboardData.setData(mimetype, str);
            event.clipboardData.setData('text/plain', str);
            event.preventDefault();
            //todo show Toast tips
        };
        document.execCommand("Copy", false, null);
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
        //todo for test
        confObj.mInterval = 10000;

        return confObj
    }

    //todo preload image before notification
    function makeNotification(itemData) {

        return bangumiUtils
          .getImgDataURL(itemData.gImage)
          .then(function (dataURL) {
              return new Promise(function (resolve, reject) {
                  var notSetting = {
                      type: "image",
                      title: itemData.title,
                      message: "来自动漫花园",
                      iconUrl: 'resources/icon.png',
                      buttons: notificationButtons
                      //the doc says resources can only use local image or dataURL here
                      , imageUrl: dataURL

                  }

                  var itemId = getNotificationId();
                  notifiedItems[itemId] = itemData;
                  chrome
                    .notifications
                    .create(itemId, notSetting, function () {
                        resolve(itemData);
                    });
              }, function () {
                  //on reject
                  console.log(arguments)
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

        //console.log(desc.match(imgReg))

        //var $ele = $(desc);

       var temp = desc.match(imgReg)
       // var temp = imgReg.exec(desc)
        if (temp) {
            obj.gImage = temp [1]+'.'+temp[2];
        }

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


