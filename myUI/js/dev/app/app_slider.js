/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){
    require('../module/imgFocus');
    require('../module/slider');
    var slider2 = require('../module/slider2');
    require('../module/slider3');
    require('../module/slider4');
    
    //序列数
    $('#J_banner1').imgFocus({dotType:'number'});
    //缩略图
    $('#J_banner2').imgFocus({dotType:'img'});
    //slider
    $('#J_slider').slider();
    //无缝滚动
    slider2();
    $('#J_marquee').marquee({direction:'left'});
    //
    $('#J_imgSlider').imgSlider();
});