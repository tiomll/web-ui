/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){
    var isIE6 = !window.XMLHttpRequest;
    $.fn.suggest = function(opts){
        var set = $.extend({
            url:''
        },opts||{});
        var _this = $(this), url = _this.data('url') || set.url, xhr, w = _this.outerWidth(), h = _this.outerHeight(), $result, $iframe, timer, searchs = {};

        _this.on('keydown', function(){
            _this.addClass('isLoading');
            xhr && xhr.abort();
            timer && clearTimeout(timer);
        }).on('keyup', function(){
            var v = $.trim(this.value);
            if(v == ''){
                _this.removeClass('isLoading');
                $result && $result.hide();
                $iframe && $iframe.hide();
                return;
            };
            if(searchs[v]){
                showData(searchs[v]);
                return;
            }
            url += (url.indexOf('?') > -1 ? '&' : '?')+this.name+'='+encodeURIComponent(v);
            timer = setTimeout(function(){
                xhr = $.ajax({
                    url:url,
                    success:function(data){
                        var data = eval(data);
                        searchs[v] = data;
                        _this.removeClass('isLoading');
                        showData(data);
                    }
                });
            },10);
        });

        function showData(data){
            var html = '<ul><li><a href="javascript:;">', pos = _this.offset(), css = {top:pos.top + h, left:pos.left, width:w};
            isIE6 && ($iframe ? $iframe.show() : ($iframe = $('<iframe marginwidth="0" marginheight="0" align="top" scrolling="no" frameborder="0" class="suggest_result_HideSelect" src="" style="position:absolute;filter:Alpha(Opacity=0);"></iframe>')).appendTo('body'));
            $iframe && $iframe.css(css);
            $result ?  $result.show() : ($result = $('<div class="suggest_result" style="position:absolute;"></div>')).appendTo('body');
            $result.css(css);
            html += data.join('</a></li><li><a href="javascript:;">')+'</a></li></ul>';
            $result.html(html);
            bindClickHandler($result)
        };

        function bindClickHandler(obj){
            obj.on('click',function(event){
                var T = event.target;
                if(T.nodeName.toLowerCase() === 'a'){
                    _this.val($(T).text());
                };
                $(this).hide();
                $iframe && $iframe.hide();
            });
        };

        $(document).on('click',function(){
            $result && $result.hide();
            $iframe && $iframe.hide();
        });

        $(window).resize(function(){
            var pos = _this.offset(), css = {top:pos.top + h, left:pos.left};
            $result && $result.css(css);
            $iframe && $iframe.css(css);
        });
    };
});
