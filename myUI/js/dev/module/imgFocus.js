/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){

    $.fn.imgFocus = function(opts){
        var set = $.extend({
            auto:1,
            timer:4000,
            showPrevAndNext:1,
            showDotControl:1,
            item:'li',
            dotType:'number', //number,img
            controlClass:'banner_control',
            eventType:'click',
            effect:'fade' //fade,slideUp,slideLeft
        },opts||{});
        var _this = $(this),$items = _this.find(set.item),len = $items.length,index=0,PrevAndNextHtml = '',DotControlHtml='';
        if(len === 0) return;
        var $dot,$prev,$next,play,timer,effect = {};
        var width = $items.eq(0).width() || set.width || 0,height = $items.eq(0).height() || set.height || 0,callback = set.callback || function(){};

        if (set.dotType ==='number') {
            var dot = new Array(len+1).join('t,').replace(/t/g,function(){return ++index;}).split(',');
            dot.pop();
            DotControlHtml = '<ol class="'+ set.controlClass +'"><li>'+dot.join('</li><li>')+'</li></ol>';
        } else if (set.dotType ==='img') {
            var imgs = _this.find('img'), html = '';
            imgs.each(function(i) {
                html += '<li><img src="'+imgs.eq(i).attr('src')+'" /></li>';
            });
            DotControlHtml = '<ol class="'+ set.controlClass +' banner_control_img">'+html+'</ol>';
        };
        index = 0;
        PrevAndNextHtml = '<a href="javascript:void(0)" class="banner_prev"></a><a href="javascript:void(0)" class="banner_next"></a>';
        set.showPrevAndNext && (_this.append(PrevAndNextHtml),$prev = _this.find('.banner_prev'),$next = _this.find('.banner_next'));
        set.showDotControl && (_this.append(DotControlHtml),$dot = _this.find('ol').find('li'));

        effect = {
            'fade': {
                init:function(){
                    $items.css('opacity',0).hide().eq(index).css('opacity',1).show();
                    $dot && $dot.eq(index).addClass('active');
                },
                go:function(p,c){
                    $items.eq(p).stop(true,true).animate({'opacity':0},function(){ $(this).hide()});
                    $items.eq(c).stop(true,true).show().animate({'opacity':1});
                    $dot && $dot.removeClass('active').eq(c).addClass('active');
                    callback.call(_this,p,c);
                    index = c;
                }
            },
            'slideUp': {
                init:function(){
                    $items.css('top',height).eq(0).css('top',0).addClass('active');
                    $dot && $dot.eq(index).addClass('active');
                },
                go:function(p,c){
                    var d = p < c ? -1 : 1;
                    $items.eq(p).stop(true,true).animate({'top':d*height});
                    $items.eq(c).stop(true,true).css('top',-1*d*height).animate({'top':0});
                    $dot && $dot.removeClass('active').eq(c).addClass('active');
                    callback.call(_this,p,c);
                    index = c;
                }
            },
            'slideLeft': {
                init:function(){
                    $items.css('left',width).eq(0).css('left',0).addClass('active');
                    $dot && $dot.eq(index).addClass('active');
                },
                go:function(p,c){
                    var d = p < c ? -1 : 1;
                    $items.eq(p).stop(true,true).animate({'left':d*width});
                    $items.eq(c).stop(true,true).css('left',-1*d*width).animate({'left':0});
                    $dot && $dot.removeClass('active').eq(c).addClass('active');
                    callback.call(_this,p,c);
                    index = c;
                }
            }
        };

        effect[set.effect].init();

        play = function(){
            timer = setInterval(function(){
                index = index++ % len;
                effect[set.effect].go(index,(index+1)%len);
            },set.timer);
        };

        set.auto && play();

        if(set.showPrevAndNext){
            $prev.on('click',function(){
                effect[set.effect].go(index,--index%len);
            });
            $next.on('click',function(){
                effect[set.effect].go(index,++index%len);
            });
        };

        if(set.showDotControl){
            $dot.each(function(i){
                $(this).on(set.eventType,function(){
                    if(index === i) return;
                    effect[set.effect].go(index,i);
                });
            });
        };

        $(this).on('mouseenter',function(){
            if(timer) clearInterval(timer);
        }).on('mouseleave',function(){
                set.auto && play();
        });

        _this.data('triggerSlide',function(c){
            effect[set.effect].go(index,c%len);
        });
    };
});
