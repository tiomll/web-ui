/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){
	$.fn.passwordStrength = function(opts){
		var set = $.extend({
            minimumChars: 6,
			strengthScaleFactor: 1,
    		bannedPasswords: [],
			banmode: 'strict', //strict、loose
    		callback:function(){}
        },opts||{});

        var min_complexity = 49; // 12个字符，包括大写字母，小写字母和数字
		var max_complexity = 120; // 25个字符，所有字符集
		var charsets = [
			[0x0030, 0x0039], // 数字
			[0x0041, 0x005A], // 大写字母
			[0x0061, 0x007A], // 小写字母
			[0x0021, 0x002F], // 标点
			[0x003A, 0x0040], // 标点
			[0x005B, 0x0060], // 标点
			[0x007B, 0x007E] // 标点
		];

        function charset(s, c) {
			for (var i = s.length - 1; i >= 0; i--) {
				if (c[0] <= s.charCodeAt(i) && s.charCodeAt(i) <= c[1]) {
					return c[1] - c[0] + 1;
				}
			}
    		return 0;
		}

		function banList(s) {
			if (set.banmode === 'strict') {
				for (var i = 0; i < set.bannedPasswords.length; i++) {
		            if (set.bannedPasswords[i].indexOf(s) !== -1) return true;
				}
				return false;
			} else {
				return $.inArray(s, set.bannedPasswords) > -1 ? true : false;
			}
		}

    	function security() {
			var p = $(this).val(), j = 0, v = false;
			// 如果发现非法密码时密码强度为 0
			if (!banList(p)) {
				// 添加字符的复杂性
				for (var i = charsets.length - 1; i >= 0; i--) {
					j += charset(p, charsets[i]);
				}
			} else {
				j = 1;
			}
			// 使用自然对数，以产生线性刻度
			j = Math.log(Math.pow(j, p.length)) * (1/set.strengthScaleFactor);
			v = (j > min_complexity && p.length >= set.minimumChars);
			// 用于进度条的百分比
			j = (j / max_complexity) * 100;
			j = (j > 100) ? 100 : j;
			set.callback.call(this, v, j);
		}

		return this.each(function () {
        	$(this).on('keyup focus', security);
		});
	}
});