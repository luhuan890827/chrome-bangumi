/**
 * Created by laury.lu on 2015/2/27.
 */
(function () {
    'use strict'
    //anyway we need server resources
    var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d')
    var utils = {};
    utils.getImgDataURL = function (url) {
        //we can just use fetch here,with server support todo
        //url="http://ww4.sinaimg.cn/bmiddle/9e6b7fdbtw1eprf2rusu5j20ex0octcn.jpg";
        //return fetch(url)
        //  .then(function(data){
        //      //window.data = data;
        //      return data.blob();
        //  })
        return new Promise(function (resolve, reject) {
            if(url){
                var img = new Image();
                var timeoutId = setTimeout(function () {
                    reject()
                }, 4000)
                img.onload = function () {
                    //console.log('###################')
                    var dataURL;
                    canvas.height = img.height;
                    canvas.width = img.width;
                    ctx.drawImage(img, 0, 0);
                    //https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement
                    clearTimeout(timeoutId)
                    try{
                        dataURL = canvas.toDataURL();
                    }catch (e){
                        reject(e)
                    }


                    resolve(dataURL)
                }
                img.src=url
            }else{
                reject();
            }



        })
    }


    window.bangumiUtils = utils;
})()