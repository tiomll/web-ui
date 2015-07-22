define(function(require,exports,module){
    $.fn.pager = function(opts){
        var set = $.extend({
            asyn:0, //是否ajax加载
            showNum:1, // 是否显示页数
            showForm:1, //是否显示跳转表单
            showPrevAndNext:1, //是否显示上一页，下一页
            timeout:5000, //ajax加载的超时界限
            contentBox:'#contentbox', //ajax加载的内容容器
            size:9, //分页显示的长度，一般为9,也可以是7或者5，不能为偶数，其它的数也没什么意义
            dataType:'json', //ajax数据类型
            beforeSend:function(){}, //ajax在发送请求之前调用，并且传入一个XMLHttpRequest作为参数
            wrongPageCall:function(){dialog.alert({title:'提示信息', content:'请输入一个正确的页码！'})}, //输入页码错误调用
            error:function(){}, //ajax在请求出错时调用
            callback:function(){} //每次ajax加载成功后的回调函数，传为的第一个参数是加截进来的数据，第二个参数是当前页数
        },opts||{});

        var _this = $(this);
        if(!_this.length) return;

        var xhr,$contentBox = $(set.contentBox),pPage,nPage,$form,
            current = _this.attr('current') - 0 || 0,
            total = _this.attr('total') - 0 || 0,
            url = _this.attr('url') || '',
            size = _this.attr('size')-0 || set.size;

        var PREVPAGE = '<a href="javascript:void(0)" class="pager_prev">\u4e0a\u4e00\u9875</a>',
            NEXTPAGE = '<a href="javascript:void(0)" class="pager_next">\u4e0b\u4e00\u9875</a>',
            JUMPFROM = '<span class="page_total">共<em>'+total+'</em>页</span><form method="get" name="pageJump" action="'+url+'" class="form_pageJump"><label>到<input type="text" name="page" class="input_item input_item_shortest"/>页</label><button type="submit" class="btn_submit">确定</button></form>'

        var sideLen=Math.floor((size - 2)/2),leftSize = sideLen+3,rightSize = sideLen+1;

        //如果只有一页
        if(total <= 1) return;

        create(current);

        function create(current){
            var html = '',index=0,len,c=0;
            var pages = new Array(total+1).join('t,').replace(/t/g,function(){ return ++index;}).split(',');
            pages.pop();
            len = pages.length;
            c = current;
            if(len > size){
                if(current < leftSize){
                    pages.splice(size-1,len-size,'<span class="pager_dot">...</span>');
                    c = current;
                }else if(current >= leftSize && current < total - rightSize){
                    pages.splice(current+sideLen,len-current-rightSize,'<span class="pager_dot">...</span>');
                    pages.splice(1,current-leftSize+1,'<span class="pager_dot">...</span>');
                    c = Math.round(size/2);
                }else{
                    pages.splice(1,len-size,'<span class="pager_dot">...</span>');
                    c = size + current - total ;
                }
            }

            for(var i=0;i<pages.length;i++){
                html += /^\d+$/.test(pages[i]) ? '<a href="javascript:void(0)" class="pager_item">'+(pages[i]-0)+'</a>' : pages[i];
            }

            html = set.showNum ? (set.showPrevAndNext ? (set.showForm ? (PREVPAGE + html +  NEXTPAGE + JUMPFROM) : (PREVPAGE + html +  NEXTPAGE)) : (set.showForm ? (html + JUMPFROM) : (html))) : (set.showPrevAndNext ? (set.showForm ? (PREVPAGE + NEXTPAGE + JUMPFROM) : (PREVPAGE + NEXTPAGE)) : (set.showForm ? (JUMPFROM) : ''));

            _this.html(html);
            $form = _this.find('form');

            set.showNum && _this.find('a').eq(set.showPrevAndNext ? c : c-1).addClass('active');

            pPage = $('.pager_prev',_this);
            nPage = $('.pager_next',_this);
            setClass(current);
        }

        function go(index,event){
            event.preventDefault();
            if(index <= 0 || index > total) return;
            var href = '';
            href = url + (url.indexOf('?') > -1 ? '&page=' : '?page=');
            if(!set.asyn){
                window.location.href = href+index;
            }else{
                setClass(index);
                $contentBox.addClass('isLoading')
                xhr && xhr.abort();
                xhr = $.ajax({
                    url:href+index,
                    timeout:set.timeout,
                    dataType:set.dataType,
                    beforeSend:function(){
                        set.beforeSend && set.beforeSend(index);
                    },
                    error: function(){
                        set.error && set.error(index);
                    },
                    success:function(data){
                        $contentBox.removeClass('isLoading').html(data);
                        set.callback && set.callback(data,index);
                    }
                });

                current = index;
                create(current);
            }
        }

        function setClass(index){
            pPage.removeClass('pager_disable pager_disable_prev');
            nPage.removeClass('pager_disable pager_disable_next');
            pPage[index == 1 ? 'addClass' : 'removeClass']('pager_disable pager_disable_prev');
            nPage[index == total ? 'addClass' : 'removeClass']('pager_disable pager_disable_next');
        }

        $(this).on('click',function(event){
            var target = event.target,$t = $(target);
            if($t.hasClass('pager_disable') || $t.hasClass('active')) return;
            if($t.hasClass('pager_prev')) go(--current,event);
            if($t.hasClass('pager_next')) go(++current,event);
            if($t.hasClass('pager_item')) go($t.text()-0,event);
        });

        $(this).find('input[type="text"]').on('keyup', function(e) {
            this.value = this.value.replace(/\D/,'');
        });

        if($form && $form.length){
            $form.on('submit',function(event){
                event.preventDefault();
                var v = $form.find('input[type="text"]').val() - 0;
                if(isNaN(v) || v < 1 || v > total ){
                    set.wrongPageCall && set.wrongPageCall.call(total,v);
                    return;
                };
                go(v,event);
            })
        }
    };
});