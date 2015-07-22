/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){
    $.fn.marquee = function(opts){
        var set=$.extend({
            isEqual:true,       //所有滚动的元素长宽是否相等,true,false
            loop:0,            //循环滚动次数，0时无限
            direction:"left",  //滚动方向，"left","right","up","down"
            scrollAmount:1,     //步长
            scrollDelay:20      //时长
        },opts||{});

        return this.each(function(){
            var _this = $(this), _scrollObj =_this.get(0), scrollW = _this.width(), scrollH = _this.height(), $element = _this.children(), $child = $element.children(), scrollSize = 0, direction = set.direction, _type=(direction=="left"||direction=="right") ? 1 : 0;

            $element.css(_type ? "width" : "height", 10000);
            if(set.isEqual){
                scrollSize = $child[_type ? "outerWidth" : "outerHeight"]() * $child.length;
            }else{
                $child.each(function(){
                    scrollSize += $(this)[_type ? "outerWidth" : "outerHeight"]();
                });
            };

            if(scrollSize < (_type ? scrollW : scrollH)) return;

            $element.append($child.clone()).css(_type ? "width" : "height",scrollSize*2);

            var moved = 0;
            function go(){
                var _dir = (direction=="left"||direction=="right") ? "scrollLeft" : "scrollTop";
                if (set.loop > 0){
                    moved += set.scrollAmount;
                    if(moved > scrollSize * set.loop){
                        _scrollObj[_dir] = 0;
                        return clearInterval(timer);
                    };
                };

                if(direction=="left"||direction=="up"){
                    var newPos = _scrollObj[_dir] + set.scrollAmount;
                    if(newPos >= scrollSize){
                        newPos -= scrollSize;
                    }
                    _scrollObj[_dir] = newPos;
                }else{
                    var newPos = _scrollObj[_dir] - set.scrollAmount;
                    if(newPos <= 0){
                        newPos += scrollSize;
                    };
                    _scrollObj[_dir] = newPos;
                };
            };

            var timer = setInterval(go, set.scrollDelay);

            _this.hover(function(){
                clearInterval(timer);
            },function(){
                clearInterval(timer);
                timer = setInterval(go, set.scrollDelay);
            });
        });
    };
});