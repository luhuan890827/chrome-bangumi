/**
 * Created by laury.lu on 2015/3/4.
 */
requirejs.config({

    baseUrl: '../js',

    paths: {
        knockout:'lib/knockout-3.3.0',
        jquery:'lib/jquery-2.1.3.min',

        _:'lib/underscore-min',
        popup:'app/popup',
        utils:'app/utils'
    },
    shim:{
        jquery:{
            exports:'$'
        }
    }
});
requirejs(['popup'],function(popup){
    popup.init();
})