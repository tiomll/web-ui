//未修复bug：验证之后删除验证会在433行 Uncaught TypeError: Cannot read property 'className' of undefined 
define(function(require,exports,module){
    var item = {
        'require':{
            'rules': /.+/,
            'error' : '必填项不能为空！'
        },
        'username':{
            'rules': /^[\u4E00-\u9FA5A-Za-z0-9_\ \.]{2,20}$/i,
            'error' : "用户名格式不正确。"
        },
        'password': {
            'rules': /^[a-zA-Z0-9\_\-\~\!\%\*\@\#\$\&\.\(\)\[\]\{\}\<\>\?\\\/\'\"]{6,20}$/,
            'error' : "您填写的密码有误。"
        },
        'number':{
            'rules': /^[-+]?(0|[1-9]\d*)(\.\d+)?$/,
            'error': '您填写的不是数字。'
        },
        'date':{
            'rules': /^\d{4}\-\d{2}-\d{2}$/,
            'error': '您填写的日期格式不正确.'
        },
        'money':{
            'rules': /^[-+]?(0|[1-9]\d*)(\.\d+)?$/,
            'error': '金额格式不正确。正确格式如：“60” 或 “60.5”。'
        },
        'per':{
            'rules': /^(?:[1-9][0-9]?|100)(?:\.[0-9]{1,2})?$/,
            'error': '您填写的百分比格式不正确！'
        },
        'email':{
            'rules': /^[0-9a-z][a-z0-9\._-]{1,}@[a-z0-9-]{1,}[a-z0-9]\.[a-z\.]{1,}[a-z]$/,
            'error': '您填写的E-mail格式不正确！正确的格式：yourname@gmail.com。'
        },
        'phone':{
            'rules': /^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/,
            'error': '您填写的电话号码格式不正确！'
        },
        'mobile':{
            'rules': /^[1-9]\d{10}$/,
            'error': '您填写的手机号码格式不正确！'
        },
        'url':{
            'rules': /^((http|https|ftp|rtsp|mms)\:\/\/)?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)$/,
            'error': '您填写的网站地址格式不正确！如：http://www.yourdomain.com/a/b.html'
        },
        'ip':{
            'rules': /^(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5])$/,
            'error': '您填写的IP地址格式不正确！正确的IP地址如：192.168.1.1。'
        },
        'zip':{
            'rules': /^[1-9]\d{5}$/,
            'error': '您填写的邮政编码格式不正确！正确的邮政编码如：430051。'
        },
        'qq':{
            'rules': /^[1-9]\d{4,14}$/,
            'error': '您填写的QQ号格式不正确！正确的QQ号如：64392719。'
        },
        'english':{
            'rules': /^[A-Za-z]+$/,
            'error': '您填写的内容含有英文字母（A-Z,a-z）以外的字符！'
        },
        'chinese':{
            'rules': /^[\u0391-\uFFE5]+$/,
            'error': '您填写的内容含非中文字符！'
        },
        'chinese2':{
            'rules': /^(?!.*[！￥……—（））——－＝：；‘’“”，。、｜《》【】].*)[\u0391-\uFFE5]+$/,
            'error': '您填写的内容含非中文字符或者标点符号！'
        },
        'ce':{
            'rules': /^[-\w\u0391-\uFFE5]+$/,
            'error': '您填写的内容不正确！'
        },
        'integer':{
            'rules': /^[-\+]?\d+$/,
            'error': '您填写的内容不是整数！'
        },
        'idcard':{
            'rules': /(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3})|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])(\d{4}|\d{3}[x]))$/,
            'error': '您填写的身份证号码格式不正确！'
        },
        'empty':{
            'rules': /^\s*$/
        },
        'anything':{
            'rules': /^[\s\S]*$/
        },
        'specialCharacter':{
            'rules': /^(?!.*[`~!@#$%^&*()\-\_+={\}\[\]\|\\:;"'<,>.?\/ `~！·#￥%……—*（）——－+＝、：；“”‘’《》，。？].*).+$/,
			'error': '您填写的信息含有非法字符！'
        }
    };

    var oClass = {
        'item_error':'item_error'    //验证没有通过时的表单元素的class
    };
    var oTip = {
        'empty':"此处为必填或必选项,不能为空！"
    };
    var doc = window.document;
    //引用事件变量，handlers用来存放事件，用处在remove验证项的同时移除相应的事件
    var blurFn,handlers = [];
    var tip,tipCon;
    var beTrigger = false;
    var validator = function(opts){
        return new validator.prototype.init(opts);
    };
    validator.prototype = {
        constructor:validator,
        //初始化
        init:function(opts){
            if(typeof opts == 'undefined') return this;
            var _this = this,form = $(opts.form);
            if(!form) return;
            this.form = form;
            this.items = [];//存放验证项的ID
            this.options = [];//存放验证项的所有参数
            this.ajaxCount = 0;
            createTip();
            addEvent(form,'submit',function(e){
                var len=_this.items.length,i=0,hasError=false,flag;
                //取消默认提交
                preventDefault(e);

                //验证所有项
                validateAll.call(_this,_this.options);
				
                //如果有ajax验证，那么必须等到全部都有返回结果
                if(_this.ajaxCount > 0){
                    alert('请等待ajax验证返回结果！');
                }

                //判断是否有没有通过的项
                for(;i<len;i++){
                    if(hasClass($(_this.items[i]),oClass['item_error'])){
                        hasError = true;
                        showTip(_this.options[i]);
                        //xp系统下的IE,给隐藏域设置focus()会报错
                        if(_this.items[i].type !== 'hidden'){
                            //$(_this.items[i]).focus();
                        }
                        break;
                    }
                }

                //如果有没有通过验证的项
                if(hasError) return false;

                //执行提交前的函数，如果有的话
                if(opts.beforeSubmit && isFunction(opts.beforeSubmit)) flag = opts.beforeSubmit.call(_this,form);

                //如果提交前的执行函数明确返回false，则阻止提交
                if(flag === false) return false;
				
                //否则，选择是以ajax的形式提交，还是默认形式提交
                opts.ajaxSubmit ? ajaxForm(form,opts.afterSubmit) : form.submit();
            });
            //返回this，实现链写
            return this;
        },
        /*************************对外接口**********************************/
        //添加验证项
        add:function(opts){
            if(!opts || !this.options) return this;
            //判断新添加的验证项是否已经存在
            var index = getIndex(opts.target,this.options);
            //如果存在，直接返回
            if(index > -1) return this;
            this.items.push(opts.target);
            this.options.push(opts);
            bindHandlers.call(this,opts);
            return this;
        },
        //移除验证项
        remove:function(el){
            if(!this.options) return this;
            var n = getIndex(el,this.options),element,handler,opt;
            if(n === -1) return this;
            this.items.splice(n,1);
            opt = this.options.splice(n,1);
            handler = handlers.splice(n,1)[0];
            element = $(el);

            //如果删除的是一个带ajax验证的
            if(opt.action) this.ajaxCount--;

            //移除所有class
            removeClass(element,oClass['item_error']);
            //移除提示信息，如果存在的话
            (tip.getAttribute('target') == el) &&  hideTip(opt);
            //移除绑定的事件处理函数
            removeEvent(element,'blur',handler['blurFn']);
            return this;
        },
        //重置
        reset:function(){
            var i=0,len = this.options.length;
            //移除所有项的class
            for(;i<len;i++){
                resetItem(this.options[i]);
            }
            //重置ajax计数器
            this.ajaxCount = 0;
        },
        //主动触发验证
        trigger:function(el,callback){
            var n = getIndex(el,this.options);
            if(n === -1) return this;
            beTrigger = true;
            blurHandler(this.options[n])();
            beTrigger = false;
            callback && callback.call(el);
        },
        extendRule:function(rules){
            extend(item,rules||{});
        },
        showTip:function(el){
            var index = getIndex(el,this.options);
            if(index === -1) return this;
            showTip(this.options[index]);
        },
        hideTip:function(el){
            var index = getIndex(el,this.options);
            if(index === -1) return this;
            hideTip(this.options[index]);
        }
    };
    validator.prototype.init.prototype = validator.prototype;
    module.exports = validator;

    /*************************私有方法**********************************/
    //绑定验证事件
    function bindHandlers(opts){
        var el = $(opts.target),defaultVal = el.getAttribute('palaceholder'),theSame;
        if(opts.sameTo) theSame = $(opts.sameTo);
        blurFn = blurHandler.call(this,opts);
        addEvent(el,'blur',blurFn);
        if(theSame){
            addEvent(theSame,'blur',function(){
                //由于IE绑定事件执行顺序混乱，所以用setTimeout来排序
                /*setTimeout(function(){
                 fireEvent(el,'blur');
                 },0);*/
                fireEvent(el,'blur');
            });
        };
        handlers.push({
            'target':opts.target,
            'blurFn':blurFn
        });
    }
    function blurHandler(opts){
        var _this = this;
        return function(){
            var el = $(opts.target),val= el.value,defaultVal = el.getAttribute('placeholder');
            //如果是主动验证的，那么值为空或是默认值的时候也需要验证，而不是重置元素
            //注意beTrigger的值的还原语句不能放在下面的ajax回调里，考虑一下同时两个主动触发ajax验证的情况
            if(!beTrigger && (val === '' || val === defaultVal) && !el.getAttribute('shouldsubmit')){
                resetItem(opts);
            }else{
                if(opts.beforeBlur && isFunction(opts.beforeBlur)) opts.beforeBlur.call(el,opts);
                validateItem.call(_this,opts);
            }
        };
    }
    //表单提交时验证所有
    function validateAll(options){
        for(var i=0,len=options.length;i<len;i++){
            validateItem.call(this,options[i]);
        }
    }
    //验证单个
    function validateItem(opts){
        var hasError,el = $(opts.target),_this = this/*,isError = hasClass(el,oClass['item_error'])*/;
		hasError = validate(opts);
        if(hasError){
            showTip(opts);
        }else{
            //如果需要ajax验证
            if(el.value && opts.action){
                _this.ajaxCount++;
                ajaxValidate(opts,function(hasError){
                    _this.ajaxCount--;
                    if(!hasError){
                        showTip(opts);
                    }else{
                        if(opts.sameTo){
                            toSame(opts);
                        }else{
                            hideTip(opts);
                        }
                    }
                });
            }else{
                hideTip(opts);
                if(opts.sameTo){
                    toSame(opts);
                }
            }
        }
    }
    //重置单个
    function resetItem(opts){
        var item = $(opts.target);
        removeClass(item,oClass['item_error']);
        item.value = '';
        hideTip(opts)
    }
    //验证
    function validate(opts){
        var el = $(opts.target),reg = '',valiFn = opts.valiFn,defaultValue = el.getAttribute('placeholder');
        if(el.value === defaultValue){el.value = '';};
        if(opts.rule_type){
            var type = opts.rule_type, rule_item = type.match(/(\w+)/g);
            for(var i=0;i<rule_item.length;i++){
                //注意这里必须用双引号，如果验证的字符串是以$结尾的，那么就会报错，因为$'是一个反向引用
                type = type.replace(rule_item[i],'chk('+ item[rule_item[i]].rules +',\"'+escaping(el.value)+'\")');
            }
            reg = type;
        }else if(opts.rule){
            reg = 'chk('+opts.rule+',\"'+escaping(el.value)+'\")';
        }else{
            return;
        }
        return !(valiFn ? (eval(reg) && valiFn.call(el,opts) !== false) : eval(reg));
    }
    //ajax验证
    function ajaxValidate(opts,callback){
        var el = $(opts.target),val = el.value , name = el.name || el.id;
        ajax({
            type: "GET",
            url: opts.action,
            noCache:true,
            data: name +'='+ encodeURIComponent(val),
            onsuccess: function(){
                var data = eval('('+this.responseText+')');
                callback(data.pass);
            }
        });
    }
    //判断两个值是否相同，如重复密码
    function toSame(opts){
        var el = $(opts.target),theSame = $(opts.sameTo),hasPass;
        if(!theSame) return;
        if(el.value === theSame.value){
            //如果相同就显示通过提示信息
            hideTip(opts);
        }else{
            //否则显示错误提示信息
            showTip(opts);
        }
    }
    function chk(reg,str){
        return reg.test(str);
    }
    //去掉换行符和首尾的空格，将/ \ ' "转义
    function escaping(val){
        return val.replace(/^\s+|\s+$/g,'').replace(/(['"\\])/g,function(a,b){ return '\\'+b;}).replace(/[\r\n]/g,'');
    }
    //显示错误提示信息
    function showTip(opts){
        var rule_type = opts.rule_type && (opts.rule_type.match(/\w+/g))[0];
        var $el = $(opts.target), val = $el.value, msg = /*val == '' ? oTip['empty'] :*/ opts.error || item[rule_type].error || '';
        var pos = position(opts.tipPos ? $(opts.tipPos) : $el);
        addClass($el,oClass['item_error']);
        tipCon.innerHTML = msg;
        tip.style.cssText = 'top:'+(pos.y-35)+'px;left:'+pos.x+'px;display:block;'
        //设置关联
        tip.setAttribute('target',opts.target);
    }
    //隐藏提示信息
    function hideTip(opts){
        var $el = $(opts.target);
        if(tip.getAttribute('target') == opts.target || tip.target == opts.sameTo) tip.style.display = 'none';
        removeClass($el,oClass['item_error']);
    }
    //创建提示信息
    function createTip(){
        if(tip) return;
        tip = createEl('<div id="valiTip"><em></em><b></b></div>',document.body);
        tipCon = createEl('<span></span>',tip);
    }
    /*************************常用工具函数**********************************/
    function $(id){
        return typeof id == 'string' ? document.getElementById(id) : id;
    }
    function $$(oClass,parent,nodename){
        var i=0,len=0,re=[],els;
        nodename = nodename || '*';
        parent = parent || doc;
        els = parent.getElementsByTagName(nodename);
        for(len=els.length;i<len;i++){
            if(hasClass(els[i],oClass)) re.push(els[i]);
        }
        return re;
    }
    function isFunction(obj){
        return typeof obj == 'function';
    }
    function trim(str){
        return str.replace(/^\s+|\s+$/,'').replace(/\s+/,' ');
    }
    function preventDefault(e){
        e = e || window.event;
        if(e.preventDefault){
            e.preventDefault();
        }else{
            e.returnValue = false;
        }
    }
    function hasClass(el,oClass){
        oClass  = ' '+ oClass + ' ';
        return (' '+el.className + ' ').indexOf(oClass) > -1 ? true : false;
    }
    function addClass(el,oClass){
        var C = trim(oClass).split(' '),eClass = el.className,i=0,len=C.length;
        for(;i<len;i++){
            if(!hasClass(el,C[i])){
                eClass+=' '+C[i];
            }
        }
        el.className = trim(eClass);
    }
    function removeClass(el,oClass){
        var C = trim(oClass).split(' '),eClass = el.className,i=0,len=C.length;
        for(;i<len;i++){
            if(hasClass(el,C[i])){
                eClass = eClass.replace(C[i],'');
            }
        }
        el.className = trim(eClass);
    }
    function createXhr(){
        if(typeof XMLHttpRequest != 'undefined'){
            return new XMLHttpRequest();
        }else{
            var xhr = null;
            try{
                xhr = new ActiveXObject('MSXML2.XmlHttp.6.0');
                return xhr;
            }catch(e){
                try{
                    xhr  = new ActiveXObject('MSXML2.XmlHttp.3.0');
                    return xhr;
                }catch(e){
                    throw Error('cannot create XMLHttp object!');
                }
            }
        }
    }
    function ajax(opts){
        var set = extend({
            url:'',
            data:'',
            type:'GET',
            timeout:5000,
            onbeforerequest:function(){},
            onsuccess:function(){},
            onnotmodified:function(){},
            onfailure:function(){}
        },opts||{});
        var xhr = createXhr();
        if((set.type).toUpperCase() == 'GET'){
            if(set.data){
                set.url += (set.url.indexOf('?') >= 0 ? '&' : '?') + set.data;
                set.data = null;
            }
            if(set.noCache){
                set.url+=(set.url.indexOf('?') >= 0 ? '&' : '?')+'t='+(+new Date());
            }
        }
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4){
                if(xhr.status >= 200 && xhr.status < 300){
                    set.onsuccess.call(xhr);
                }else if(xhr.status == 304){
                    set.onnotmodified.call(xhr);
                }else{
                    set.onfailure.call(xhr);
                }
            }
        };
        xhr.open(set.type,set.url);
        if((set.type).toUpperCase() == 'POST'){
            xhr.setRequestHeader('content-Type','application/x-www-form-urlencoded');
        }
        set.onbeforerequest();
        if(set.timeout){
            setTimeout(function(){
                xhr.onreadystatechange = function(){};
                xhr.abort();
                set.onfailure();
            },set.timeout);
        }
        xhr.send(set.data);
    }
    function encodeNameAndValue(sName,sValue){
        return encodeURIComponent(sName)+'='+encodeURIComponent(sValue);
    }
    //序列化表单
    function serializeForm(form){
        var oForm = $(form),els = oForm.elements,len=els.length,i=0;
        var re = [];
        for(;i<len;i++){
            var el = els[i];
            switch(el.type){
                case 'select-one' :
                case 'select-multipe':
                    for(var j=0,l=el.options.length;j<l;j++){
                        var opt = el.options[j];
                        if(opt.selected){
                            var v = '';
                            if(opt.hasAttribute){
                                v = opt.hasAttribute('value') ? opt.value : opt.text;
                            }else{
                                v = opt.attributes['value'].specified ? opt.value : opt.text;
                            }
                            re.push(encodeNameAndValue(el.name,v));
                        }
                    }
                    break;
                case undefined :
                case 'fieldset' :
                case 'button' :
                case 'submit' :
                case 'reset' :
                case 'file' :
                    break;
                case 'checkbox' :
                case 'radio' :
                    if(!el.checked){
                        break;
                    }
                default :
                    re.push(encodeNameAndValue(el.name,el.value));
                    break;
            }
        }
        return re.join('&');
    }
    //以ajax的形式提交表单
    function ajaxForm(form,onsuccess){
        ajax({
            type:form.method,
            url:form.action,
            data:serializeForm(form),
            onsuccess:onsuccess
        });
    }
    function extend(target,source){
        for(var key in source){
            target[key] = source[key];
        }
        return target;
    }
    function addEvent(el,type,fn){
        if(typeof el.addEventListener != 'undefined'){
            el.addEventListener(type,fn,false);
        }else if(typeof el.attachEvent != 'undefined'){
            el.attachEvent('on'+type,fn);
        }else{
            el['on'+type] = fn;
        }
    }
    function removeEvent(el,type,fn){
        if(typeof el.removeEventListener != 'undefined'){
            el.removeEventListener(type,fn,false);
        }else if(typeof el.detachEvent != 'undefined'){
            el.detachEvent('on'+type,fn);
        }else{
            el['on'+type] = null;
        }
    }
    function fireEvent(el,type){
        if(typeof document.createEventObject == 'object'){
            return el.fireEvent('on'+type);
        }else{
            var e = document.createEvent('HTMLEvents');
            e.initEvent(type,true,true);
            return !el.dispatchEvent(e);
        }
    }
    function position(el){
        var x = 0,y=0;
        if(el.getBoundingClientRect){
            var pos = el.getBoundingClientRect();
            var d_root = document.documentElement,db = document.body;
            x = pos.left + Math.max(d_root.scrollLeft,db.scrollLeft) - d_root.clientLeft;
            y = pos.top + Math.max(d_root.scrollTop,db.scrollTop) - d_root.clientTop;
        }else{
            while(el != db){
                x += el.offsetLeft;
                y += el.offsetTop;
                el = el.offsetParent;
            }
        }
        return {
            x:x,
            y:y
        };
    }
    function createEl(html,parent){
        var div = document.createElement('div'),el;
        div.innerHTML = html;
        el = div.firstChild;
        parent && parent.appendChild(el);
        return el;
    }
    function getIndex(obj,arr,prop){
        var i= 0,len=arr.length;
        for(;i<len;i++){
            if(obj === arr[i][prop||'target']){
               return i;
            }
        }
        return -1;
    }
});
