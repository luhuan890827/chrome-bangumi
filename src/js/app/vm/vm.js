/**
 * Created by laury.lu on 2015/3/3.
 */
define(function(require,exports,module){
    var ko = require('knockout');
    var _runtime = chrome.runtime

     function AppVM(){
        var that = this;
        that.buttName = ko.observable('马上检查');
        that.checkRss = function(data,evt){
            //todo post message to bg
            sendMsg({action:'sync'})
        }
    }
    function sendMsg(msg){
        _runtime.sendMessage(_runtime.id,msg,function(resp){
            console.log(resp)
        })

    }
    module.exports = {
        AppVM:AppVM
    }
})

