/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){
    $.fn.zebraLists = function(opts){
        var set = $.extend({
            children:'',
            oddClass:'odd',
            evenClass:'even',
            overClass:'hover'
        },opts||{});
        var $child = $(this).find(set.children),
            evenClass = set.evenClass,
            oddClass = set.oddClass,
            overClass = set.overClass;

        $child.each(function(i){
            $(this).removeClass(evenClass + ' ' + oddClass).addClass(i%2 == 0 ? set.evenClass : set.oddClass);
        });

        $(this).on('mouseenter',set.children,function(){
            $(this).addClass(overClass)
        }).on('mouseleave',set.children,function(){
            $(this).removeClass(overClass)
        })
    };
});
