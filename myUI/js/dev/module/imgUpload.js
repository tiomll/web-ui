/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){
	$.fn.imgUpload = function(opts){
		var set = $.extend({
			ruleType: ['gif','jpg','jpeg','png'],
			filePath: '#file_path',
			preview: '#J_view',
			maxWidth: 200,
			maxHeight: 200,
			change: function(){}
		},opts||{});
		var ruleType = set.ruleType, $path = $(set.filePath), $preview = $(set.preview), $img;
		
		$preview.append($img = $(document.createElement('img')).hide());

		$(this).on('change', function() {
			var fileName = this.value.replace(/^.*\\/,''), fileExt = fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase();

			if (!Array.indexOf) {
				Array.prototype.indexOf = function(obj){
					var i = 0, l = this.length;
					for (; i < l; i++) {
						if (this[i]==obj) {
							return i;
						}
					}
					return -1;
				}
			}

			if (ruleType.indexOf(fileExt) > -1) {
				$path.html(fileName);
				$img.show().attr({alt: fileName});
				if(this.files && this.files[0]){
					var reader = new FileReader();
					reader.readAsDataURL(this.files[0]);
					reader.onload = function (e) {
						$img.attr('src', e.target.result).css(imageScaling(set.maxWidth, set.maxHeight, $img.width(), $img.height()));;
					}
				} else {
					this.select();
					this.blur();
					var reallocalpath = document.selection.createRange().text; //IE下获取实际的本地文件路径
					document.selection.empty();
					if (!window.XMLHttpRequest) {
						$img.attr('src', reallocalpath).css(imageScaling(set.maxWidth, set.maxHeight, $img.width(), $img.height()));;
					} else {
						$img.attr('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==').css({'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod="crop",src="' + reallocalpath + '")', width: set.maxWidth, height: set.maxHeight}); //IE7-9滤镜不好控制宽高，采用最大宽高并裁剪滤镜
					}
				}

				$img.on('load',function(){
					set.change.call(this);
				});
			} else {
				this.value = '';
				$path.html('');
				$img.attr({'src': 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', 'alt': ''}).hide();
				dialog.alert({content: '请选择格式为 '+ruleType+' 的图片！'});
				return;
			}
		});

		function imageScaling (W, H, w, h){
			var par = {width:w, height:h};
			if ( w>W || h>H) {
				var rw = w / W;
				var rh = h / H;
				if (rw > rh) {
					par.width = W;
					par.height = Math.round(h / rw);
				} else {
					par.width = Math.round(w / rh);
					par.height = H;
				}
			}
			return par;
		}
    }
});