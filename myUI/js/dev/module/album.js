/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){

	var imgReady = (function () {
		var list = [], intervalId = null,
	
		// 用来执行队列
		tick = function () {
			var i = 0;
			for (; i < list.length; i++) {
				list[i].end ? list.splice(i--, 1) : list[i]();
			};
			!list.length && stop();
		},
	
		// 停止所有定时器队列
		stop = function () {
			clearInterval(intervalId);
			intervalId = null;
		};
		
		//此处的闭包会造成内存浪费
		return function (url, ready, load, error) {
			if(!url) return;
			var onready, width, height, newWidth, newHeight,
				img = new Image();
			
			img.src = url;
	
			// 如果图片被缓存，则直接返回缓存数据
			if (img.complete) {
				ready.call(img);
				load && load.call(img);
				return;
			};
			
			width = img.width;
			height = img.height;
			
			// 加载错误后的事件
			img.onerror = function () {
				error && error.call(img);
				onready.end = true;
				img = img.onload = img.onerror = null;
			};
			
			// 图片尺寸就绪
			onready = function () {
				newWidth = img.width;
				newHeight = img.height;
				if (newWidth !== width || newHeight !== height ||
					// 如果图片已经在其他地方加载可使用面积检测
					newWidth * newHeight > 1024
				) {
					ready.call(img);
					onready.end = true;
				};
			};
			onready(); //默认执行一遍
			
			// 完全加载完毕的事件
			img.onload = function () {
				// onload在定时器时间差范围内可能比onready快
				// 这里进行检查并保证onready优先执行
				!onready.end && onready();
			
				load && load.call(img);
				
				// IE gif动画会循环执行onload，置空onload即可
				img = img.onload = img.onerror = null;
			};
	
			// 加入队列中定期执行
			if (!onready.end) {
				list.push(onready);
				// 无论何时只允许出现一个定时器，减少浏览器性能损耗
				if (intervalId === null) intervalId = setInterval(tick, 40);
			};
		};
	})();
	//查看照片
	$.fn.album = function(opts){
		var set = $.extend({
            prevPage:'#J_sbarprev',
            nextPage:'#J_sbarnext',
            slider:'#J_sbar',
            currClass:'curr',
            prevdClass:'prev_disable',
            nextdClass:'next_disable',
            imgWrap:'#J_img',
			maxWidth:809,
			index:0,
			visibleLen:9,
			cursorPath:'images'
        },opts||{});
		var _this = $(this), prev = $(set.prevPage), next = $(set.nextPage), prevdClass = set.prevdClass, nextdClass = set.nextdClass, $slider = $(set.slider), sl = $slider.children(), c = sl.children(), wr = $(set.imgWrap), mW = set.maxWidth, cW = c.outerWidth(true), cL = c.length, index = set.index, l = set.visibleLen;
		
		prev.addClass(prevdClass);
		if (cL <= l) next.addClass(nextdClass);
		$slider.scrollLeft(0);
		
		var _index = Math.floor(index/l)*l;
		//上一页
		prev.on("click",function(e){
			e.preventDefault();
			if(_index < l) return;
			next.removeClass(nextdClass);
			if(_index <= l){
				prev.addClass(prevdClass);
			}
			_index -= l;
			$slider.stop(true,true).animate({scrollLeft: _index * cW},function(){
				c.eq(_index+l-1).children("a").click();
			});
		});
		//下一页
		next.on("click",function(e){
			e.preventDefault();
			if(_index >= cL-l) return;
			
			_index += l;
			prev.removeClass(prevdClass);
			if(cL - _index <= l ){
				next.addClass(nextdClass);
			}
			$slider.stop(true,true).animate({scrollLeft: _index * cW},function(){
				c.eq(_index).children("a").click();
			});
		});
		//缩略图单击
		c.children().on("click", function(event){
			event.preventDefault();
			var oldH = wr.height();
			wr.height(oldH < 40 ? 40 : oldH);
			$(this).parent().addClass("curr").siblings().removeClass("curr");
			wr.children().remove();
			
			a = imgReady(this.href, function(){
				var W = this.width, H = this.height;
				if(W > mW){
					this.width = mW;
					this.height = Math.round(mW * H / W);
				}
				wr.append(this);
				wr.height("auto");
			});
			__photoid = $(this).prev().val();
		});
		
		//图片区域移动鼠标时和单击时
		wr.mousemove(function(e){
			var $this = $(this), positionX = e.pageX-$this.offset().left, i = sl.children("li."+set.currClass).index();
			if(positionX <= $this.width()/2){
				if (i <= 0) {
					$this.prop("title","已经是第一张了！").css("cursor","default");
				} else {
	            	$this.prop("title","上一张").css("cursor","url("+ set.cursorPath +"/cur_left.cur), auto");
	            }
	        }else{
	        	if (i >= cL - 1) {
	        		$this.prop("title","已经是最后一张了！").css("cursor","default");
	        	} else{
	            	$this.prop("title","下一张").css("cursor","url("+ set.cursorPath +"/cur_right.cur), auto");
	            }
	        }
		}).click(function() {
			var $this = $(this), img = $(this).children('img'), curr = sl.children("li."+set.currClass);
			if($this.prop("title") == "上一张"){
				if(!curr.prev().length) return;
				if(curr.index() == _index){
					prev.click();
				}else{
					curr.prev().children("a").click();
				}
			}else if($this.prop("title") == "下一张"){
				if(!curr.next().length) return;
				if(curr.index()+1 == _index + l){
					next.click();
				}else{
					curr.next().children("a").click();
				}
			}
		});
		c.eq(index).children().click();
		return this;
    };
});