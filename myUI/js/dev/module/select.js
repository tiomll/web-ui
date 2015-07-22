define(function(require,exports,module){

	var Select = function(opts){ return new Select.prototype.init(opts)};
    Select.prototype = {
        constructor:Select,
        init:function(opts){
            this.set = $.extend({
                target:'',
                change:function(){}
            },opts||{});
            this.target = $(this.set.target);
            if(this.target.length === 0) return this;
            this.els = _createElement.call(this,this.target);
            this.outer = this.els.outer;
            this.wraper = this.els.wraper;
            this.save = this.els.save;
            this.vbox = this.els.vbox;
            this.mask= this.els.mask;
            this.datas = this.build.call(this)();
            this.target.on('change',this.build.call(this));
            this.save.on('click',this._toggleOptions.call(this));
            this.datas.on('click',this._selectOptions.call(this));
            $(document).on('click',this._hideOptions.call(this));
        },
        getVal:function(){
            return this.target[0].value;
        },
        setVal:function(val){
            this.target[0].value = val;
            this.target.trigger('change');
        },
        build:function(){
            var self = this,dataItem;
            return function(){
                self.datas && (self.datas.remove());
                self.current = self.target[0].selectedIndex || 0;
                self.datas = _getData.call(self,self.target);
                dataItem = self.datas.find('a');
                self.els.outer.append(self.datas);
                self.els.vbox.text(dataItem.eq(self.current).text());
                self.datas.height() > 300 && self.datas.height(300);
                self.datas.width(self.els.outer[0].offsetWidth-2);
                self.mask && self.mask.height(self.datas.height()+self.els.vbox[0].offsetHeight+10);
                self.datas.off().on('click',self._selectOptions.call(self));
                return self.datas;
            }
        },
        _toggleOptions:function(){
            var self = this;
            return function(e){
                var f;
                e.stopPropagation();
                self.save.find('i').toggleClass('select_arrow_down');
                self.datas.toggle();
                f = self.datas.css('display') !== 'none';
                f && _setPos.call(self,self.datas);
                self.wraper.css('position', f ? 'relative':'static');
                self.mask[f ?'show':'hide']();
                $('.select_data').not(self.datas).hide();
                $('.select_wraper').not(self.wraper).css('position','static');
            };
        },
        _selectOptions:function(){
            var self = this;
            return function(e){
                var $target = $(e.target),val = $target.data('value') || $target.text();
                self.target[0].value = val;
                self.target.trigger('change');
                self.set.change.call(self,val);
                self._hideOptions();
            }
        },
        _hideOptions:function(){
            var self = this;
            return function(){
                self.datas.hide();
                self.mask.hide();
                self.wraper.css('position','static');
                self.save.find('i').removeClass('select_arrow_down');
            };
        }
    };

    Select.prototype.init.prototype = Select.prototype;
    module.exports = Select;

    /*************************************************************************************************/
    var isIE6 = !window.XMLHttpRequest,
        isIe=/msie ((\d+\.)+\d+)/i.test(navigator.userAgent) ? (document.documentMode ||  RegExp['\x241']) : false;
    function _createElement(obj){
        var el = obj[0],options = el.options,index = this.current || 0,h = el.offsetHeight-(isIe && isIe < 8 ? 4 : 10),w =el.offsetWidth;
        var text = options[index].text;
        var $wraper = $('<div class="select_wraper" style="width:'+w+'px;"></div>'),
            $outer = $('<div class="select_outer"></div>'),
            $save = $('<div class="select_save"><i class="select_arrow"></i></div>'),
            $vbox = $('<div class="select_vbox"></div>'),
            $mask = $('<iframe marginwidth="0" marginheight="0" align="top" scrolling="no" frameborder="0" class="select_mask" src="" style="position:absolute;top:0;left:0;width:'+w+'px;height:0px;filter: Alpha(Opacity=0);display:none;"></iframe>');

        $wraper.insertAfter(obj).append(obj.hide());
        $vbox.text(text);
        $outer.append($save.append($vbox));
        isIE6 && $wraper.append($mask);
        $wraper.append($outer);

        return {
            wraper:$wraper,
            outer:$outer,
            save:$save,
            vbox:$vbox,
            mask:$mask
        };
    };

    function _getData(obj){
        var el = obj[0],options = el.options,index = this.current || 0,i=0,len=options.length,html='<ul class="select_data">';
        var text = $(options[index]).text();
        for(;i<len;i++){
            html += '<li><a href="javascript:;" '+ (i === index ? 'class="active"' : '')+' data-value="'+options[i].value+'">'+options[i].innerHTML + '</a></li>';
        };
        return $(html);
    };
    function _setPos(obj){
        var save = this.els.save,top = save.offset().top,h = save[0].offsetHeight,oH = obj[0].offsetHeight,dH = document.documentElement.clientHeight;
        var f = top+h+oH > dH && top > dH-top-h;
        obj.css('top',f ? 1-oH : h-1)
    };
});