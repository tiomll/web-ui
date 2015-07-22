/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){
    $.fn.ajaxDelete = function(opts){
        var set = $.extend({
            title:'删除提示',
            content:'您确定要删除该数据？',
            target:''
        },opts||{});
        $(document).on('click',$(this).selector,function(e){
            e.preventDefault();
            var url = this.href || $(this).data('url'), _this = this;
            dialog.confirm({
                title:set.title,
                content:set.content,
                callback:function(v){
                    v && $.ajax({
                        url:url,
                        dataType:'json',
                        success:function(data){
                            if(!data.error){
                                if(set.callback){
                                    set.callback.call(_this,data);
                                    set.ondeleted && set.ondeleted.call(_this,data)
                                }else{
                                    $(_this).closest(set.target).fadeOut('fast',function(){
                                        set.ondeleted && set.ondeleted.call(_this,data)
                                        $(this).remove();
                                    });
                                }
                            }else{
                                dialog.alert({
                                    title:'删除提示',
                                    content:data.error
                                });
                            }
                        },
                        error:function(){
                            dialog.alert({title:'删除提示',content:'删除数据失败！'});
                        }
                    });
                }
            });
        })
    };
});
