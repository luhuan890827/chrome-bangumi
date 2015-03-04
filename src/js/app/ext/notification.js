/**
 * Created by laury.lu on 2015/3/3.
 */
define(function(require,exports,module){
    var utils = require('utils')
    var notificationButtons = [
        {title: "查看发布页"},
        {title: "复制磁力链"}
    ]
    var cachedData = {}
    function createOrShow(itemData,reshow) {

        return utils
          .getImgDataURL(itemData.image)
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

                  var itemId = itemData.pubDate.getTime()+''
                  if(itemId in cachedData&&reshow){
                     //reshow
                      chrome
                        .notifications
                        .update(itemId,{priority:0},function(existed){
                        //todo
                          if(existed){
                              chrome
                                .notifications
                                .update(itemId,{priority:1},function(existed){
                                  resolve(itemData)
                              })
                          }
                      })
                  }else{
                      cachedData[itemId] = itemData;
                      chrome
                        .notifications
                        .create(itemId, notSetting, function () {
                            resolve(itemData);
                        });
                  }

              })
          })


    }
    //todo clear cached when clear notifications

    chrome.notifications.onButtonClicked.addListener(onNotificationButtonClick);

    function onNotificationButtonClick(notificationId, buttonIndex) {
        var bangumiData = cachedData[notificationId + '']
        if (buttonIndex === 0) {
            //查看发布页面
            window.open(bangumiData.link)
        }
        if (buttonIndex === 1) {
            //复制磁力链接
            utils.copyTextToClipBoard(bangumiData.magnet)
        }

    }
    module.exports = {
        createOrShow:createOrShow
    }
})