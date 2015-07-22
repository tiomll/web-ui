/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){

    $.fn.slider = function(opts){
        var set = $.extend({
            prev:'.slider_prev', //向前滚动
            next:'.slider_next', //向后滚动
            auto:0,  //是否自动滚动
            time:5000, //自动滚动的间隔时间
            hoverStop:0, //自动滚动时，鼠标移上去是否停止
            range:'',  //每次滚动的范围，数字，可以不填 ，默认为列表的第一项的宽度
            slideCon:'#slider_box', //滚动层
            prevdc:'slider_prev_disable',
            nextdc:'slider_nextt_disable',
            effect:0 //Left:0, Up:1
        },opts||{});
        var _this = $(this), $prev = $(set.prev,_this), $next = $(set.next,_this), auto = set.auto, time = set.time, $slideCon = $(set.slideCon,_this), sPrevDisableClass = set.prevdc, sNextDisableClass = set.nextdc, $child = $slideCon.children(), count = $child.length - 1, current = 0, timer = null, isSliding = false, 
        reach = set.effect ? $child.outerHeight(true) * (count+1) : $child.outerWidth(true) * (count+1),
        range = set.range || (set.effect ? $child.outerHeight(true) : $child.outerWidth(true));

        $prev.addClass(sPrevDisableClass);
        if(!$child.length) $next.addClass(sNextDisableClass);

        function go(n){
            isSliding = true;
            current = auto ? (current+n) % (count+1) : current+n;
            var s = (current+1)*range >= reach ? (reach-(set.effect ? $child.outerHeight(true) : $child.outerWidth(true))) : range*current;

            if (set.effect) {
                $slideCon.stop(true).animate({'top':-1*s},function(){
                    $prev[current == 0 ? 'addClass': 'removeClass'](sPrevDisableClass);
                    $next[current == count ? 'addClass': 'removeClass'](sNextDisableClass);
                    if(current > 0 && current < count ){
                        $prev.removeClass(sPrevDisableClass);
                        $next.removeClass(sNextDisableClass);
                    };
                    isSliding = false;
                    auto && autoSlide();
                });
            } else {
                $slideCon.stop(true).animate({'left':-1*s},function(){
                    $prev[current == 0 ? 'addClass': 'removeClass'](sPrevDisableClass);
                    $next[current == count ? 'addClass': 'removeClass'](sNextDisableClass);
                    if(current > 0 && current < count ){
                        $prev.removeClass(sPrevDisableClass);
                        $next.removeClass(sNextDisableClass);
                    };
                    isSliding = false;
                    auto && autoSlide();
                });
            };
        };

        function autoSlide(){
            timer = setTimeout(function(){
                go(1);
            },time);
        };

        auto && autoSlide();

        $prev.on('click',function(event){
            event.preventDefault();
            if($(this).hasClass(sPrevDisableClass) || isSliding) return;
            timer && clearInterval(timer);
            go(-1);
        });

        $next.on('click',function(event){
            event.preventDefault();
            if($(this).hasClass(sNextDisableClass) || isSliding) return;
            timer && clearInterval(timer);
            go(1);
        });

        if(set.hoverStop){
            $slideCon.hover(function(){
                timer && clearInterval(timer);
            },function(){
                auto && autoSlide();
            });
        };
    };
});
