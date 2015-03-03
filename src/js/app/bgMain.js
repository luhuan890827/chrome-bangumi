/**
 * Created by laury.lu on 2015/3/3.
 */
requirejs.config({

    baseUrl: 'src/js',

    paths: {


        _:'lib/underscore-min',
        bg:'app/bg',
        notification:'app/ext/notification',
        utils:'app/utils',
        rss:'app/d/rss'

    }
});
requirejs(['bg'],function(bg){
    bg.start()
})