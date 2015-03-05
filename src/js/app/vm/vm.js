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
        var TXT_AVAILABLE = '马上同步';
        var TXT_SYNCING = '正在同步';
        var TXT_DONE='同步完成'
        var that = this;
        that.buttName = ko.observable(TXT_AVAILABLE);
        that.clazz = ko.computed(function(){
            if(that.buttName()!==TXT_AVAILABLE){
                return 'disabled'
            }else{
                return ''
            }
        },that)

        that.checkRss = function (data, evt) {

            that.buttName(TXT_SYNCING)

            sendMsg({action: utils.const.SYNC}).then(function(){
                that.buttName(TXT_DONE);
                setTimeout(function(){
                    that.buttName(TXT_AVAILABLE)
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

