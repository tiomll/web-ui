/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){
	module.exports = function(opts){
		var set = $.extend({
        	target:'#J_grade',
        	currClass:'on',
        	msg:[],
        	callback:function(){}
        },opts||{});

        var _this = $(set.target), $grade = _this.children(), l = $grade.length, msg = set.msg, index = iScore = iStar = 0;
        var p = $('<p></p>'), span = $('<span></span>');
        p.insertAfter(span.insertAfter(_this));

        $grade.each(function(index) {
        	var pT = '<em><b>'+(index+1)+'</b> 分'+msg[index].match(/(.+)\|/)[1]+'</em>'+msg[index].match(/\|(.+)/)[1],
        		spanT = '<strong>'+(index+1)+' 分</strong> ('+msg[index].match(/\|(.+)/)[1]+')';

        	$(this).hover(function(index) {
        		fnPoint($(this).index());
	        	p.html(pT);
	        	p.css({
        			'display': 'block',
        			'left': ($(this).index()+1) * $(this).outerWidth()
        		});
        	}, function() {
        		fnPoint();
				p.css('display', 'none');
        	}).click(function(index) {
	        	iStar = $(this).index();
				p.css('display', 'none');
				span.html(spanT);
				set.callback;
	        });
        });

        function fnPoint(iArg){
			iScore = iArg || iStar;
			$grade.eq(iScore).addClass(set.currClass).prevAll().addClass(set.currClass);
			$grade.eq(iScore).nextAll().removeClass(set.currClass);
		}
	};
});