/**
 * Created by laury.lu on 2015/3/3.
 */
requirejs.config({

    baseUrl: './src/js',

    paths: {
        knockout:'lib/knockout-3.3.0',
        jquery:'lib/jquery-2.1.3.min',
        fetch:'lib/fetch',
        _:'lib/underscore-min.js'
    },
    shim:{
        jquery:{
            exports:'$'
        }
    }
});
requirejs([''],function(){

})