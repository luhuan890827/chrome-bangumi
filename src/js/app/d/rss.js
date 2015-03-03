/**
 * Created by laury.lu on 2015/3/3.
 */
define(function (require, exports, module) {

    var imgReg = /<img.+src="(.+)\.(jpg|png|jpeg|gif)".+>/i;

    function parseItemNode(mNode) {
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
            obj.image = temp [1] + '.' + temp[2];
        }

        return obj
    };
    function query() {
        var url = ['http://share.dmhy.org/topics/rss', '', '', '', 'rss.xml'].join('/')
        return fetch(url)
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
              return bangumiInfoArr
          })
    };

    module.exports = {
        query: query
    }
})