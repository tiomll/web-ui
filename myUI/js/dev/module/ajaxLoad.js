define(function(require,exports,module){
    var ajaxLoad = function(opts){ return new ajaxLoad.prototype.init(opts);};

    ajaxLoad.prototype = {
        constructor:ajaxLoad,
        init:function(opts){
            this.set = $.extend({
                target:'',
                trigger:'',
                clear:0,
                active:'active',
                tClass:'curr',
                click:function(){},
                loadBefore:function(){},
                loaded:function(){},
                content:''
            },opts||{});

            var _this = this,active = this.set.active,tClass = this.set.tClass;

            this.target = $(this.set.target);
            if(!this.target.length) return this;

            this.trigger = $(this.set.trigger,this.target);
            this.xhr = null;
            this.old = '';

            $(document).on('click',this.set.target +' '+ this.set.trigger,function(event){
                event.preventDefault();
                var $t = $(this),url = $t.attr('href') || $t.data('url'),$content = $(_this.set.content);
                _this.trigger.removeClass(active);
                $t.addClass(active);
                _this.set.click($t,_this.target,_this.trigger,$content);
                _this.old = $content.html();
                _this._load(url);
                if(_this.set.clear){
                    _this.trigger.removeClass(tClass);
                    $t.addClass(tClass);
                }else{
                    $t.toggleClass(tClass);
                }
            });
        },
        trigger:function(n){
            var url="",$item;
            if(isNumber(n)){
                $item = this.trigger.eq(n);
                url = $item.attr('href') || $item.data('url');
            }else if(typeof n === 'string'){
                n = this.trigger.index(n);
                if(n > -1){
                    $item = this.trigger.eq(n);
                    url = $item.attr('href') || $item.data('url');
                }
            }else if(n.constructor === 'jQuery' && n.length){
                url = n.attr('href') || n.data('url');
            };

            url != "" && _load(url);
        },
        _load:function(url){
            var _this = this,$content = $(_this.set.content);
            this.xhr && this.xhr.abort();
            this.xhr = $.ajax({
                url:url,
                dataType:'html',
                beforeSend:function(){
                    _this.set.loadBefore();
                },
                error:function(){
                    $content.html(this.old);
                },
                success:function(data){
                    $content.html(data);
                    _this.set.loaded.call(_this,data,$content,url);
                }
            });
        }
    };

    ajaxLoad.prototype.init.prototype = ajaxLoad.prototype;
    module.exports = ajaxLoad;
});