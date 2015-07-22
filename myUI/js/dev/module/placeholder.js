define(function(require,exports,module){

	$.fn.placeholder = function(opts){
		var set = $.extend({
				iClass:'placeholder'
			},opts||{}),

			isSupported = (function(){
				var input = document.createElement('input');
				return 'placeholder' in input;
			})(),
			forms = [],
			dv = '';

		//如果浏览器支持placeholder，直接返回
		if(isSupported) return;

		$(this).each(function(){
			var _this = $(this),
				defaltText = _this.attr('placeholder') || '',
				$form = _this.closest("form"),
				val = this.value;
            //避免给同一个form多次绑定submit事件
            if(!$form.data('placeholder')){ 
            	forms.push($form); 
            	$form.data('placeholder', true);
            };

			//如果默认值为空，则直接返回
			if(defaltText === '') return this;

			//设置默认值并加上一个自定义的Class让文字变灰
			if(val == '') _this.addClass(set.iClass).val(defaltText);

			_this.on('focus',function(){
				var v = this.value;
				if(v == defaltText){
					this.value = '';
					_this.removeClass(set.iClass);
				};
			}).on('blur',function(){
				var v = this.value;
                //当用户输入的值与placeholder相同，给该元素添加一个自定义属性进行标示，以便提交时进行区分
				if(v == defaltText) _this.data('shouldsubmit',true);
				if(v == ''){
					this.value = defaltText;
					_this.addClass(set.iClass);
				};
			});

		});

        $(forms).each(function(){
            /*
            *  父级表单提交前判断一下该元素的值是否有placeholder属性，这里需要注意一点，
            *  当用户输入值的和placeholder的值相同的时候，这个时候是需要提交的，支持placeholder的浏览器也是这个样子的
            *  所以上面的onblur的时候需要给它加一个自定义属性以便这里提交的时候进行区分
            *  当没有shouldsubmit属性，且值和placeholder相同，说明它是不需要提交的，否则就是需要提交的
            * */
            $(this).on('submit',function(){
                $(':input',this).each(function(){
                    dv = this.getAttribute('placeholder');
                    if(dv !== ''){
                        var v = this.value;
                        if(v === dv && !$(this).data('shouldsubmit')) this.value = '';
                    }
                });
            });
        });
	};

	$('[placeholder]').placeholder();
});