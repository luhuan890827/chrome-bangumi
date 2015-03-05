define(function(require,exports,module){
    var vm = require('app/vm/vm')
    var ko = require('knockout')
    var $ = require('jquery')
    function init(){
        //console.log(chrome.runtime)
        ko.applyBindings(new vm.AppVM());
    }



    module.exports={
        init:init
    }
})