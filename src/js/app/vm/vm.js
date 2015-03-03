/**
 * Created by laury.lu on 2015/3/3.
 */
define(function(require,exports,module){
    var ko = require('knockout');
    var AppVM = function(){
        var that = this;
        that.buttName = ko.observable('马上检查');
        that.checkRss = function(data,evt){

        }
    }
    module.exports = {
        AppVM:AppVM
    }
})