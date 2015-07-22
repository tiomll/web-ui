/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){
	/*
        说明：  通用图片放大器插件,支持同一页面多个放大
        用法：  $('.J_zoom').imgzoom();
    */
	$.fn.imgzoom = function (opts) {
		var set = $.extend({
			target: '.J_img', //需要放大的图片
			cutover: '.J_cutover', //图片切换触点
			currClass: 'selected', //当前选中项的类名
			zoom: {
				x: 310, //放大宽度
				y: 310 //放大高度
			},
			offset: 10, //偏移
			position: 'right', //偏移方向(right/left)
			preload: 1 //预加载下一张图片
		}, opts||{});

		$(this).each(function() {
			var $this = $(this), $target = $this.find(set.target), $cutover = $this.find(set.cutover), currClass = set.currClass, zoomX = set.zoom.x, zoomY = set.zoom.x, offset = set.offset;

			$target.on('mouseenter', function() {
				_this = this, $targetOffset = $target.offset(), $targetParent = $target.parent(), $targetOffsetOffset = $targetParent.offset(),
				image = {
					left: $targetOffset.left,
					top: $targetOffset.top,
					width: _this.offsetWidth,
					height: _this.offsetHeight,
					alt: _this.alt
				}, 
				box = {
					left: $targetOffsetOffset.left - 1,
					top: $targetOffsetOffset.top - 1,
					width: $targetParent.width(),
					height: $targetParent.height()
				};

				if (set.position == "right") {
					leftpos = (box.left + box.width + offset + zoomX > screen.width) ? (box.left - offset - zoomX) : (box.left + box.width + offset);
				} else {
					leftpos = image.left - zoomX - offset;
					(leftpos < 0) && (leftpos = image.left + image.width + offset);
				}

				($this.find('div.zoomDiv').length == 0) && $this.append('<div class="zoomDiv" style="top:'+box.top+'px; left:'+leftpos+'px; width:'+zoomX+'px; height:'+zoomY+'px; display:block;"><img class="bigimg" src="'+$target.attr('rel')+'" alt="'+_this.alt+'" /></div><div class="zoomMask">&nbsp;</div>');

				$target.css('cursor', 'crosshair');

				$(document).on('mousemove', function(e) {
					var mouse = {x: e.pageX, y: e.pageY};
					if (mouse.x < image.left || mouse.x > image.left + image.width || mouse.y < image.top || mouse.y > image.top + image.height) {
						$(document).off("mousemove");
						$this.find('div.zoomMask').remove();
						$this.find('div.zoomDiv').remove();
						return;
					}

					var $bigimg = $this.find('.bigimg')[0], scalex = ($bigimg.offsetWidth / image.width), scaley = ($bigimg.offsetHeight / image.height), _width = zoomX / scalex, _height = zoomY / scaley, $mask = $this.find('div.zoomMask'), $zoomDiv = $this.find('div.zoomDiv');

					var posX = (mouse.x - _width / 2 < image.left) ? image.left : (mouse.x + _width / 2 > image.width + image.left) ? (image.width + image.left - _width) : (mouse.x - _width / 2),
						posY = (mouse.y - _height / 2 < image.top) ? image.top : (mouse.y + _height / 2 > image.height + image.top) ? (image.height + image.top - _height) : (mouse.y - _height / 2);

					$mask.css({
						'top': posY,
						'left': posX,
						'width': _width,
						'height': _height,
						'visibility': 'visible'
					});
					$zoomDiv[0].scrollLeft = (mouse.x - _width / 2 - image.left) * scalex;
					$zoomDiv[0].scrollTop = (mouse.y - _height / 2 - image.top) * scaley;
				});
			});

			$cutover.on('click', function() {
				var $img = $(this);

				$(this).closest("li").addClass(currClass).siblings().removeClass(currClass);
				$target.attr({
					src: $img.attr("mid"),
					rel: $img.attr("big"),
					alt: $img[0].alt
				}).closest('a').attr('href', $img.attr("big"));

				if (set.preload) {
					($this.find('div.J_preload').length == 0) && $this.append('<div style="display:none;" class="J_preload"></div>');
					$this.find('div.J_preload').html('<img src="'+$img.attr("big")+'" alt="'+$img[0].alt+'" />');
				};
			}).eq(0).trigger('click');
		});
	}
});