/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){
    $.fn.allChoose = function(opts){
        var set = $.extend({
            target:'' //与全选对应的复选框集合的选择器
        },opts||{});
        var T = $(this),items = $(set.target).filter(":enabled");
        T.on('click',function(){
            items.prop('checked',this.checked);
            //如果有多个地方控制一个复选框集(考虑上下都有全选的情况)
            T.prop('checked',this.checked);
        });
        items.on('click',function(){
            T.prop('checked',items.not(':checked').length === 0);
        });
    };
});