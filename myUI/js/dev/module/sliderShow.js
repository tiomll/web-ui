/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){
	var div = document.createElement('div'), divStyle = div.style, support = $.support;

	support.transform = 
	divStyle.MozTransform === '' ? 'MozTransform' :
		(divStyle.MsTransform === '' ? 'MsTransform' :
		(divStyle.WebkitTransform === '' ? 'WebkitTransform' :
			(divStyle.OTransform === '' ? 'OTransform' :
				false)));
	support.matrixFilter = !support.transform && divStyle.filter === '';
	div = null;

	$.cssNumber.rotate = true;
	$.cssHooks.rotate = {
		set: function(elem, value) {
			var _support = support, supportTransform = _support.transform, cos, sin, centerOrigin;

			if (typeof value === 'string') {
				value = toRadian(value);
			}

			$.data(elem, 'transform', {
				rotate: value
			});

			if (supportTransform) {
				elem.style[supportTransform] = 'rotate(' + value + 'rad)';

			} else if (_support.matrixFilter) {
				cos = Math.cos(value);
				sin = Math.sin(value);
				elem.style.filter = [
					"progid:DXImageTransform.Microsoft.Matrix(",
					"M11=" + cos + ",",
					"M12=" + (-sin) + ",",
					"M21=" + sin + ",",
					"M22=" + cos + ",",
					"SizingMethod='auto expand'",
					")"
				].join('');

				if (centerOrigin = $.rotate.centerOrigin) {
					elem.style[centerOrigin == 'margin' ? 'marginLeft' : 'left'] = -(elem.offsetWidth / 2) + (elem.clientWidth / 2) + "px";
					elem.style[centerOrigin == 'margin' ? 'marginTop' : 'top'] = -(elem.offsetHeight / 2) + (elem.clientHeight / 2) + "px";
				}
			}
		},
		get: function(elem, computed) {
			var transform = $.data(elem, 'transform');
			return transform && transform.rotate ? transform.rotate : 0;
		}
	};
	$.fx.step.rotate = function(fx) {
		$.cssHooks.rotate.set(fx.elem, fx.now + fx.unit);
	};
	function radToDeg(rad) {
		return rad * 180 / Math.PI;
	}
	function toRadian(value) {
		if (value.indexOf("deg") != -1) {
			return parseInt(value, 10) * (Math.PI * 2 / 360);
		} else if (value.indexOf("grad") != -1) {
			return parseInt(value, 10) * (Math.PI / 200);
		}
		return parseFloat(value);
	}
	$.rotate = {
		centerOrigin: 'margin',
		radToDeg: radToDeg
	};

	$.fn.sliderShow = function (opts){
		var set = $.extend({
			sliderShow: '#J_slideShow',
			prev: '#J_prevLink',
			next: '#J_nextLink'
		}, opts || {});
		
		var _this = $(this), $sliderShow = $(set.sliderShow, _this), $prev = $(set.prev, _this), $next = $(set.next, _this), $ul = $sliderShow.find('ul'), $li = $ul.find('li'), length = $li.length;

		updateZindex();

		if ($.support.transform) {
			$li.find('img').css('rotate',function(i){ return (-90*i) + 'deg'; });
			$sliderShow.on('rotateContainer', function(e, direction, degrees){
				$sliderShow.animate({
					width: 510,
					height: 510,
					marginTop: 0,
					marginLeft: 0
				}, 'fast', function(){
					if(direction == 'next'){						
						$('li:first').fadeOut('slow', function(){
							$(this).remove().appendTo($ul).show();
							updateZindex();
						});
					} else {
						var liLast = $('li:last').hide().remove().prependTo($ul);
						updateZindex();
						liLast.fadeIn('slow');
					}
					$sliderShow.animate({				
						rotate: Math.round($.rotate.radToDeg($sliderShow.css('rotate'))+degrees) + 'deg'
					}, 'slow').animate({
						width: 490,
						height: 490,
						marginTop: 10,
						marginLeft: 10
					}, 'fast');
				});
			});

			$sliderShow.on('showNext', function(){
				$sliderShow.trigger('rotateContainer',['next', 90]);
			});
			
			$sliderShow.on('showPrevious', function(){
				$sliderShow.trigger('rotateContainer',['previous', -90]);
			});
		} else {
			$sliderShow.on('showNext', function(){
				$('li:first').fadeOut('slow', function(){
					$(this).remove().appendTo($ul).show();
					updateZindex();
				});
			});
			
			$sliderShow.on('showPrevious', function(){
				var liLast = $('li:last').hide().remove().prependTo($ul);
				updateZindex();
				liLast.fadeIn('slow');
			});
		}

		$prev.on('click', function(e) {
			e.preventDefault();
			if ($sliderShow.is(':animated')) {
				return false;
			}
			$sliderShow.trigger('showPrevious');
			return false;
		});

		$next.on('click', function(e) {
			e.preventDefault();
			if ($sliderShow.is(':animated')) {
				return false;
			}
			$sliderShow.trigger('showNext');
			return false;
		});

		function updateZindex(){
			$ul.find('li').css('z-index', function(i){
				return length - i;
			});
		};
	};
});