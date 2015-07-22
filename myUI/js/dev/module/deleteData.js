/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){

    /*普通删除*/
    $.fn.deleteData = function(opts){
        var set = $.extend({
            title:'删除提示',
            content:'您确定要删除该数据？'
        },opts||{});
        $(this).each(function(){
            $(this).click(function(event){
                event.preventDefault();
                var url = this.href;
                dialog.confirm({
                    title:set.title,
                    content:set.content,
                    callback:function(v){
                        v && (document.location.href = url)
                    }
                });
            });
        });
    };
});
