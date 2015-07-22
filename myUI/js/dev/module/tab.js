/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){
    /*
        说明：  通用选项卡插件,支持无限嵌套
        用法：  $('.J_tab').tab();
    */
    $.fn.tab = function(opts){
        var set = $.extend({
            tabClass: '', //选项卡的类
            conClass: '', //相对应的内容的类
            activeClass: '',  //当前激的选项卡的类
            defaultDis: 0, //默认激活的选项卡
            eventType: 'click' //触发事件，默认为click，也可以是mouseenter
        },opts||{});
        $(this).each(function(){
            var _this = $(this), $tabs = _this.find(set.tabClass), $cons = _this.find(set.conClass);
            //如果选项卡的长度与内容的长度不相等，抛错
            if($tabs.length !== $cons.length) throw new Error('\u9009\u9879\u5361\u7684\u957f\u5ea6\u4e0e\u5185\u5bb9\u7684\u957f\u5ea6\u4e0d\u76f8\u7b49');
            $tabs.removeClass(set.activeClass).eq(set.defaultDis).addClass(set.activeClass);
            $cons.hide().eq(set.defaultDis).show();
            $tabs.each(function(i){
                $(this).on(set.eventType, function(event){
                    var target = event.target;
                    if(target.nodeName.toLowerCase() === 'a') event.preventDefault();
                    $tabs.removeClass(set.activeClass);
                    $(this).addClass(set.activeClass);
                    $cons.hide().eq(i).show();
                });
            });
        });
    };
})
