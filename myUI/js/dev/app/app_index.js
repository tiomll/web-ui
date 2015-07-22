/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){
    require('../plugs/lightbox/view');
    require('../plugs/lightbox/codemirror');
    require('../plugs/lightbox/css');
    require('../plugs/lightbox/javascript');
    require('../plugs/lightbox/xml');
    require('../plugs/lightbox/htmlmixed');
    require('../plugs/prettyPhoto/js/jquery.prettyPhoto');

    $(".page_cont a[rel^='prettyPhoto']").prettyPhoto({
        animation_speed:'fast',
        slideshow:3000,
        autoplay_slideshow: false,
        social_tools:false
    });
});