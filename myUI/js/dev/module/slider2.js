/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){

	module.exports = function(opts){
        var set = $.extend({
        	target:'#J_slider',
            prev:'#J_prev',
            next:'#J_next',
            slideCon:'#J_slider_cont',
            auto:0, //是否自动滚动
            speed:1000, //自动滚动的间隔时间
            hoverStop:0, //自动滚动时，鼠标移上去是否停止
            effect:0, //Left:0, Up:1
            eventType:'click' //触发事件，默认为click，也可以是mouseenter
        },opts||{});

        var _this = $(set.target), $prev = $(set.prev,_this), $next = $(set.next,_this), $slideCon = $(set.slideCon,_this), $child = $slideCon.children(), reach = set.effect ? $child.outerWidth(true) : $child.outerHeight(true),timer = null, auto = set.auto, time = set.speed, $effect = set.effect;

        function go(n){
        	if(n == 1){
            	$slideCon.children().eq(0).clone(true, true).appendTo($slideCon);
            	$slideCon.animate($effect ? {'top': -n*reach} : {'left': -n*reach}, function(){
            		$slideCon.css($effect ? {'top': 0} : {'left': 0}).children().eq(0).remove();
            	});
        	} else {
        		$slideCon.children().eq(-1).clone(true, true).prependTo($slideCon);
				$slideCon.css($effect ? {'top': n*reach} : {'left': n*reach}).animate($effect ? {'top': 0} : {'left': 0},function(){
					$slideCon.children().eq(-1).remove();
				});
			}
            auto && autoSlide();
        };

        function autoSlide(){
            timer = setTimeout(function(){
                go(1);
            },time);
        };
        auto && autoSlide();

        $prev.on(set.eventType,function(e){
        	e.preventDefault();
        	timer && clearInterval(timer);
            go(-1);
        });

        $next.on(set.eventType,function(e){
            e.preventDefault();
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