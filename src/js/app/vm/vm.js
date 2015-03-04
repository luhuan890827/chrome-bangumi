/**
 * Created by laury.lu on 2015/3/3.
 */
define(function (require, exports, module) {
    var ko = require('knockout');
    var _runtime = chrome.runtime
    var utils = require('utils')

    function AppVM() {
        this.syncButton = new SyncButton()
    }
    function SyncButton(){
        var that = this;
        that.buttName = ko.observable('马上检查');


        that.checkRss = function (data, evt) {
            //todo post message to bg
            that.buttName('正在检查...')
            sendMsg({action: utils.const.SYNC}).then(function(){
                that.buttName('检查完成');
                setTimeout(function(){
                    that.buttName('马上检查')
                },1000)
            })
        }
    }
    function sendMsg(msg) {
        return new Promise(function(resolve,reject){
            _runtime.sendMessage(_runtime.id, msg, function (resp) {
                if (resp.action === utils.const.DONE) {
                    resolve()
                }
            })
        })


    }

    module.exports = {
        AppVM: AppVM
    }
})

