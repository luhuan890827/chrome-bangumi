define(function(require,exports,module){
    var vm = require('app/vm/vm')
    var ko = require('knockout')
    function init(){
        ko.applyBindings(new vm.AppVM());
    }



    module.exports={
        init:init
    }
})