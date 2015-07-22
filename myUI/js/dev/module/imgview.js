/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){

	module.exports = function(opts){
        var set = $.extend({
        	target:'#J_imgview',
        	imgWrap:'#J_imgwrap',
        	prev:'#J_prev',
        	next:'#J_next',
        	title:'#J_title',
        	data:[]
        },opts||{});

        var _this = $(set.target), $imgWrap = _this.find(set.imgWrap), $prev = _this.find(set.prev), $next = _this.find(set.next), $title = _this.find(set.title), data = set.data, index = 0;

        _this.mousemove(function(e){
			var positionX = e.pageX - _this.offset().left;
			if(positionX <= _this.width() / 2){
				$prev.stop().animate({opacity: 100}, 1000);
				$next.stop().animate({opacity: 0}, 400);
	        }else{
				$next.stop().animate({opacity: 100}, 1000);
				$prev.stop().animate({opacity: 0}, 400);
	        }
		}).mouseout(function(){
			$prev.stop().animate({opacity: 0}, 400);
			$next.stop().animate({opacity: 0}, 400);
		});

		$prev.on('click', function(e) {
			e.preventDefault();
			if (index <= 0) {
				dialog.alert({title:'提示信息', content:'前面没有图片了！'});
				return;
			};
			index--;
			loadImg();
		});

		$next.on('click', function(e) {
			e.preventDefault();
			if (index >= data.length - 1) {
				dialog.alert({title:'提示信息', content:'这是最后一张图片了！'});
				return;
			};
			index++;
			loadImg();
		});
	
		var loadImg = function(){
			$imgWrap.addClass('loading');
			$title.css({height:0}).children().css({opacity:0});

			if ($imgWrap.has('img')) {
				$imgWrap.children('img').remove();
			};
			var _img = document.createElement("img");
			var newImg = new Image();
			newImg.onload = function () {
				$imgWrap.removeClass('loading');
				_img.src = this.src;
				_img.alt = this.alt;
				$imgWrap.append(_img);
				_img.style.width = (_img.offsetWidth > _this.width() ? _this.width() : _img.offsetWidth) + "px";
				$imgWrap.height = _img.style.height = _img.offsetHeight * _img.offsetWidth / _img.offsetWidth + "px";
				$title.animate({height:50}, 400).children().text(data[index].title).animate({opacity:70}, 1000);
			};
			newImg.src = data[index].src;
			newImg.alt = data[index].title;
		}

		loadImg();
	};
});