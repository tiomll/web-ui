/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){

    module.exports = function(opts){
        var set = $.extend({
        	target:'',
            tab:'', //选项卡的类
            con:'', //存放内容的类
            activeClass:'', //当前激的选项卡的类
            defaultDis:0, //默认激活的选项卡
            cache:1, //是否起用缓存
            eventType:'click', //触发事件，默认为click，也可以是mouseenter,
            callback:function(){} //每次加载完成后的回调,this指向当前选项卡，第一个参数是加载进来的内容
        },opts||{});

        var _this = $(set.target),
        	$tabs = _this.find(set.tab),
            $cons = _this.find(set.con),
            activeClass = set.activeClass,
            defaultDis = set.defaultDis,
            useCache = set.cache,
            callback = set.callback,
            cache = [],
            url;

        $cons.length === 0 && ($cons = $(set.con));

        var load = function(index){
            var $obj = $tabs.eq(index);
                url = $obj.attr('href') || $obj.data('url'); 

            //使用缓存
            if(useCache && cache[index]){
                $cons.html(cache[index]).next('isLoading').hide();
                callback.call(_this,cache[index],index,$tabs,$cons);
                $tabs.removeClass(activeClass).eq(index).addClass(activeClass);
                return _this;
            };

            $.ajax({
                type:'get',
                url:url,
                cache:useCache,
                timeout:5000,
                beforeSend:function(){
                    $cons.hide().next('.isLoading').show();
                },
                error:function(){
                    $cons.show().html('<p class="error">获取数据失败！</p>').next('.isLoading').hide();
                    $tabs.removeClass(activeClass).eq(index).addClass(activeClass);
                },
                success:function(data){
                    if (!data || !data.length) {
                        $cons.show().html('<p class="error">获取数据失败！</p>').next('.isLoading').hide();
                        $tabs.removeClass(activeClass).eq(index).addClass(activeClass);
                    } else {
                        $cons.show().html(data).next('.isLoading').hide();
                        cache[index] = data;  //缓存加载的内容
                        callback.call(_this,data,index,$tabs,$cons);
                        $tabs.removeClass(activeClass).eq(index).addClass(activeClass);
                    };
                }
            });

        }

        $tabs.removeClass(activeClass).eq(defaultDis).addClass(activeClass);

        _this.on(set.eventType, set.tab, function(event){
        	event.preventDefault();
        	load($tabs.index(this))
        }).data('trigger',load);

        load(defaultDis);
    };
})