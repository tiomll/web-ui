/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){
    require('../module/album');
    var imgview = require('../module/imgview');
    require('../module/dialog');
    require('../plugs/prettyPhoto/js/jquery.prettyPhoto');
    require('../module/sliderShow');
    
    $('#J_album_view').album({
    	index:0,
    	visibleLen:9,
    	cursorPath:'images'
    });

    $.ajax({
        url: 'imgdata.php',
        type: 'GET',
        dataType: 'json',
        success: function(data){
            imgview({
                data:data
            })
        }
    });

    $("#J_img_list a[rel^='prettyPhoto']").prettyPhoto({
        animation_speed:'fast',
        slideshow:3000,
        autoplay_slideshow: false,
        social_tools:false
    });

    $('#J_slideShowContainer').sliderShow();
});