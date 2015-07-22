/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
 define(function(require,exports,module){
    var defaultTitle = '';

    $(document).on('click','a[data-dialog]',function(e){
    	e.preventDefault();
        var _this = $(this), opts = eval('('+_this.data('dialog') +')'),
            _type = opts.type, _title = opts.title, _content = opts.content, _width = opts.width, _height= opts.height, _callback = opts.callback, _closeCall = opts.closeCall,
        	width = /load/.test(_type) ? 720 : 400;
        	
        dialog[_type||'loadIframe']({
            title:_title || defaultTitle,
            content:_content || this.href || _this.data('url'),
            width:_width || width,
            height:_height || 'auto',
            callback:_callback || function(){},
            closeCall:_closeCall || function(){}
        });
    });
});