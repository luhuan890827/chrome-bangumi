/**
 * Created by laury.lu on 2015/2/27.
 */
(function () {



    fetch('http://share.dmhy.org/topics/rss/rss.xml')
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
      .then(function(allInf){
          console.log(allInf)
      })

    function parseItem(mNode){
        var obj = {};
        obj.title = mNode.getElementsByTagName('title')[0].childNodes[0].textContent;
        obj.link = mNode.getElementsByTagName('link')[0].textContent;
        obj.pubDate = new Date(mNode.getElementsByTagName('pubDate')[0].textContent)
        obj.magnet = mNode.getElementsByTagName('enclosure')[0].attributes[0].value;
        return obj
    }

})()


