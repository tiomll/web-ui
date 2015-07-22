define(function(require,exports,module){

    $.fn.loadData = function(opts){
        var set = $.extend({
            contentBox:'',
            tip:'',
            combo:0,
            loadClass:'',
            callback:function(){}
        },opts||{});

        var _this = $(this);
        if(!_this.length) return;
        var url, $con, $text = _this.find(set.tip), needTip = $text.length, $loadClass = set.loadClass;
        var pageNum = 2, max = _this.data('maxpage')-0, initCon, isLoading = false;
        var sLoading = "\u6570\u636e\u52a0\u8f7d\u4e2d...",
            sLoadMore="\u8f7d\u5165\u66f4\u591a",
            sNoContent="\u6ca1\u6709\u66f4\u591a\u6570\u636e\u4e86...",
            sLoadError="\u6570\u636e\u52a0\u8f7d\u5931\u8d25!";
        $(document).on('click',_this.selector,function(event){
            event.preventDefault();
            url = _this.attr('href') || _this.data('url');
            url += (url.indexOf('?')> -1 ? '&page=' : '?page=');
            $con = $(set.contentBox);
            initCon = $con.html();
            if(isLoading) return;
            $.ajax({
                url:url + pageNum++ ,
                dataType:'html',
                beforeSend:function(){
                    isLoading = true;
                    _this.addClass($loadClass);
                    if(needTip) $text.text(sLoading);
                },
                error:function(){
                    isLoading = false;
                    _this.removeClass($loadClass);
                    if(needTip) $text.text(sLoadError);
                },
                success:function(data){
                    isLoading = false;
                    if(typeof data != 'string'|| data.replace(/\s+/g,'') == ''){
                        $con.html(initCon);
                        _this.removeClass($loadClass);
                        if(needTip) $text.text(sNoContent);
                        set.callback.call($con,initCon,url);
                        isLoading = true;//让后面的点击失效
                    }else{
                        _this.removeClass($loadClass);
                        if(needTip) $text.text(sLoadMore);
                        if(set.combo){
                            $con.html($con.html() + data);
                            if(pageNum > max){
                                _this.remove();
                            }
                        }else{
                            $con.html(data);
                        }
                        set.callback.call($con,data,url);
                    }
                }
            });
        });
    };
});
