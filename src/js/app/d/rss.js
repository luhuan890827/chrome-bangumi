/**
 * Created by laury.lu on 2015/3/3.
 */
define(function (require, exports, module) {
'use strict'
    var imgReg = /<img.+src="(.+)\.(jpg|png|jpeg|gif)".+>/i;
    var sortIdReg = /\/sort_id\/(\d+)/
    var confObj = getRssConf();
    function getRssConf(){
        return {
            //订阅源
            rssUrl:'http://share.dmhy.org/topics/rss/rss.xml',
            //需要订阅的分类id
            sortId:[],
            //排序关键字
            sortKey:''
        }
    }

    function parseItemNode(mNode) {
        var obj = {};
        obj.title = mNode.getElementsByTagName('title')[0].childNodes[0].textContent;
        obj.link = mNode.getElementsByTagName('link')[0].textContent;
        obj.pubDate = new Date(mNode.getElementsByTagName('pubDate')[0].textContent)
        obj.magnet = mNode.getElementsByTagName('enclosure')[0].attributes[0].value;


        var desc = mNode.getElementsByTagName('description')[0].childNodes[0].textContent

        if(desc){
            var temp = desc.match(imgReg)
        }

        if (temp) {
            obj.image = temp [1] + '.' + temp[2];
        }

        var catURL = mNode.getElementsByTagName('category')[0].attributes.domain.value

        obj.sortId = catURL.match(sortIdReg)[1]

        return obj
    };
    function query() {

        return fetch(confObj.rssUrl)
          .then(function (resp) {
              return resp.text();
          })
          .then(function (xmlText) {
              var parser = new DOMParser();
              var _doc = parser.parseFromString(xmlText, "application/xml");
              var items = _doc.getElementsByTagName('item');
              var bangumiInfoArr = [];
              [].forEach.call(items, function (aNode, index) {
                  var obj = parseItemNode(aNode);
                  bangumiInfoArr.push(obj)

              })
              var result = bangumiInfoArr
              if(confObj.sortId.length>0){
                  result.filter(function(ele){
                      return confObj.sortId.indexOf(parseInt(ele.sortId))>=0
                  })
              }

              return result
          })
    };

    module.exports = {
        query: query
    }
})