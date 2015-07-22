(function(){
	var $bd = $('body');
	var h = Math.max(document.documentElement.clientHeight,document.body.scrollHeight);
	var $codeLayer = $('<div id="codeLayer" style="height:'+h+'px"></div>');
	var $codeBox = $('<div id="codeBox"></div>');
	var $codeHd = $('<div id="codeHd" class="clear"></div>');
	var $codeTit = $('<h2></h2>');
	var $codeClos = $('<a href="javascript:;" id="codeClos"></a>')
	var $codeBd = $('<div id="codeBd"></div>');
	var $codeFt = $('<div id="codeFt"></div>');
	var $codeRun = $('<a href="#" id="codeRun" target="_blank">Run</a>')
	var $codeClose = $('<a href="javascript:;" id="codeClose">Close</a>');
	
	$codeBox.append($codeHd).append($codeBd).append($codeFt);
	$codeHd.append($codeTit).append($codeClos);
	$codeFt.append($codeRun).append($codeClose);
	
	$('.view').each(function(){
		$(this).click(function(event){
			var p = $(this).parents('li.ui_list_item');
			var codes = p.find('div.code-warpper').find('textarea');
			var T = p.find('.ui_list_item_title').text();
			var c,t;
			var url = this.href;
			event.preventDefault();
			codes.each(function(){
				var _this = this;
				setTimeout(function(){
					t = _this.className.match(/code\-(\w+)/)[1];
					t = t == 'html' ? 'text/html' : t;
					c = _this.cloneNode(true);
					$('<div class="code-box"><h3>'+t.toUpperCase()+':</h3></div>').append(c).appendTo($codeBd);
					var myCodeMirror = CodeMirror.fromTextArea(c,{
						'mode':t,
						'theme':'monokai',
						'lineNumbers':1,
						'lineWrapping':1,
						'electricChars':1,
						'smartIndent':1
					});
				},0);
			});
			$codeTit.text(T);
			$codeRun.attr('href',url)
			$bd.append($codeLayer).append($codeBox);
			
			setTimeout(function(){
				cententAndFixElement($codeBox[0]);
			},0);
			
			$(document).on('click', '#codeClose, #codeClos', function() {
				$codeLayer.remove();
				$codeBox.remove();
				$codeBd.empty();
			});
		});
	});
	
	function cententAndFixElement(el){
		var w = el.offsetWidth,h = el.offsetHeight;
		var isIE6 = !window.XMLHttpRequest;
		el.style.marginTop = '-'+h/2+'px';
		el.style.marginLeft = '-'+w/2+'px';
		if(isIE6){
			el.style.position = 'absolute';
			$(window).scroll(function(){
				el.style.marginTop = '-'+(document.body.scrollTop + h/2) + 'px';
				el.style.marginLeft = '-'+(document.body.scollLeft + w/2) + 'px';
			});
		}else{
			el.style.position = 'fixed';
		}
	}
	
})(jQuery);