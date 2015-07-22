/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){
    /*
     * 说明：评分插件，给元素加一个data-grade属性，值为'5-4.5',表示总值是５，
     * */
    $.fn.grade = function(opts){
        var set = $.extend({},opts||{});
        var _this = $(this);
        if(_this.length === 0) return;
        var C = _this.children().eq(0),W = _this.width(),D = _this.data('grade').split('-'),t = D[0]*1,g = D[1]* 1, V,pos,p;
        if(typeof t != 'number' || typeof g != 'number') throw new Error('数据必须是数字类型！');
        V = Math.ceil((g/t)*100);
        C.css('width',V + '%');
        set.callback && set.callback.call(_this,g);
        if(set.save){
            _this.on('mousemove',function(event){
                pos = _this.offset();
                V = Math.ceil((event.pageX-pos.left)*t/W);
                C.width(V * (100/t) + '%');
                _this.attr('title',V);
                set.moveHandler && set.moveHandler.call(_this,V);
            }).on('click',function(event){
                    $(set.save).val(V);
                    g = V;
                    set.callback && set.callback.call(_this,V);
                    //_this.off('mousemove');
                }).on('mouseout',function(){
                    C.css('width',(g/t)*100 + '%');
                    _this.attr('title',g);
                    set.outHandler && set.outHandler.call(_this,g);
                });
            $(set.save).val(g);
        }
        return this;
    };
});
