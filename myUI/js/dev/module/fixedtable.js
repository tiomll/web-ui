define(function(require,exports,module){
    var sortRule = {
        int:function (v){ return parseInt(v,10) || 0},
        float:function(v){ return parseFloat(v,10) || 0},
        date:function(v){ return Date.parse(v) ||0;},
        bool:function(v){ return v === true || String(v).toLowerCase() == 'true' ? 1 : 0},
        string:function(v){ return v.toString() || ''}
    };

    var tableGrid = function(opts){return new tableGrid.prototype.init(opts);};
    tableGrid.prototype = {
        constructors:tableGrid,
        init:function(opts){
            this.set = $.extend({
                target:'',
                fixedRows:1,
                fixedCols:1,
                width:700,
                height:400
            },opts||{});
            var _this = this,st,sl,inputs;
            this.target = this.target || $(this.set.target);
            this.cellWidth = [];
            this.cellWidth2 = [];
            this.cellHeight = [];
            this.cellHeight2 = [];
            this.targetWidth=0;
            this.oldFixedRows = this.set.fixedRows;
            this.oldFixedCols = this.set.fixedCols;
            
            this.fCols=$(''); //取第一列，用来设置右侧内容的高度
            this.fRows = this.target.find('tr').eq(0); //取第一行用来设置下面的宽度
            
            this.wrapper = (this.wrapper && this.wrapper.empty()) || $('<div class="tableWrapper" id="J_tableWapper" style="position:relative;overflow:auto;width:'+(this.set.width || this.target.width()+17)+'px;height:'+(this.set.height || this.target.height()+17)+'px;"></div>').insertBefore(this.target); //整体容器
            this.TL = $('<div class="tableTopLeft" style="position:absolute;background:#fff;z-index:10;"></div>'); //固定在左上角的容器
            this.T = $('<div class="tableTop" style="position:absolute;background:#fff;z-index:9;"></div>'); //固定在顶部的容器
            this.L = $('<div class="tableLeft" style="position:absolute;background:#fff;z-index:9;"></div>'); //固定在左侧的容器
            this.M = $('<div class="tableMain" style="position:absolute;background:#fff;z-index:8;"></div>'); //剩下的内容容器
            
            $('tr',this.target).each(function(){
                _this.fCols = _this.fCols.add($(this).children().eq(0));
            });

            this.fRows.children().each(function(){
                _this.cellWidth.push(getWidth(this,1));
                _this.cellWidth2.push(getWidth(this));
            });

            this.fCols.each(function(){
                _this.cellHeight.push(getHeight(this,1));
                _this.cellHeight2.push(getHeight(this));
            });

            this.fixed(this.set.fixedRows,this.set.fixedCols);

            this.target.find('input[type="checkbox"]').each(function(){
                if($(this).data('checked')) this.checked = true;
            });

            this.wrapper.off().on('scroll',function(){
                var t = this.scrollTop,l = this.scrollLeft;
                _this.TL.css({'top':t,'left':l});
                _this.T.css('top',t);
                _this.L.css('left',l);
            }).on('click',function(event){
                var $t = $(event.target);
                if($t.data('sort')-0){
                    _this.sort($t);
                };
            });
        },
        fixedCols:function(col){
            this.fixed(this.set.fixedRows,col);
            this.set.fixedCols = col;
            this.wrapper[0].scrollLeft = 0;
        },
        fixedRows:function(row){
            this.fixed(row,this.set.fixedCols);
            this.set.fixedRows = row;
            this.wrapper[0].scrollTop = 0;
        },
        fixed:function(row,col){
            var top,bottom,left,right,tl,_this = this;
            this.target[0].style.cssText = '';
            if(!isNaN(row) && row !== 0){
                (top = this.target.clone(true)).find('tr:gt('+(row-1)+')').remove();
                (bottom = this.target.clone(true)).find('tr:lt('+ row +')').remove();
            };
            if(!isNaN(col) && col !== 0){
                (left = this.target.clone(true)).find('tr').each(function(){
                    $(this).children(':gt('+(col-1)+')').remove();
                });
                (right = this.target.clone(true)).find('tr').each(function(){
                    $(this).children(':lt('+ col +')').remove();
                });
            };
            if((!isNaN(col) && col !== 0) && (!isNaN(row) && row !== 0)){
                (tl= top.clone(true)).find('tr').each(function(){
                    $(this).children(':gt('+(col-1)+')').remove();
                });
                top.find('tr').each(function(){
                    $(this).children(':lt('+col+')').remove();
                });
                bottom.find('tr').each(function(){
                    $(this).children(':lt('+ col+')').remove();
                });
                left.find('tr:lt('+ row +')').remove();
                right.find('tr:lt('+ row +')').remove();
            };
            

            var wleft = sum(this.cellWidth2.slice(0,col)),wright = sum(this.cellWidth2.slice(col)),
                tHeight = sum(this.cellHeight2.slice(0,row)),bHeight = sum(this.cellHeight2.slice(row));

            if(tl){
                this.TL.html(tl).css({
                    'top':0,
                    'left':0,
                    'width':wleft
                }).appendTo(this.wrapper).find('tr').each(function(i){
                    $(this).on('mouseover',function(){
                        $(this).addClass('over');
                        _this.T.find('tr').eq(i).addClass('over');
                    }).on('mouseout',function(){
                        $(this).removeClass('over');
                        _this.T.find('tr').eq(i).removeClass('over');
                    });
                });
            };
            if(top){
                this.T.html(top).appendTo(this.wrapper).css({
                    'top':0,
                    'left':wleft,
                    'width':wright
                }).find('tr').each(function(i){
                    $(this).children().each(function(i){
                        $(this).width(_this.cellWidth[col+i]).height(_this.cellHeight[row+i]);
                    });
                    $(this).on('mouseover',function(){
                        $(this).addClass('over');
                        _this.TL.find('tr').eq(i).addClass('over');
                    }).on('mouseout',function(){
                        $(this).removeClass('over');
                        _this.TL.find('tr').eq(i).removeClass('over');
                    });
                });
            };
            if(left){
                this.L.html(left).appendTo(this.wrapper).css({
                    'top':tHeight,
                    'left':0,
                    'width':wleft
                }).find('tr').each(function(i){
                    $(this).children(':first').height(_this.cellHeight[row+i]);
                    $(this).on('mouseover',function(){
                        $(this).addClass('over');
                        _this.M.find('tr').eq(i).addClass('over');
                    }).on('mouseout',function(){
                        $(this).removeClass('over');
                        _this.M.find('tr').eq(i).removeClass('over');
                    });
                }).end().find('tr:first').children().each(function(i){
                    $(this).width(_this.cellWidth[i]);
                });
            };
            if(right){
                this.M.html(right).appendTo(this.wrapper).css({
                    'top':0,
                    'left':wleft,
                    'width':wright
                }).find('tr').each(function(i){
                    $(this).children(':first').height(_this.cellHeight[row+i]);
                    $(this).on('mouseover',function(){
                        $(this).addClass('over');
                        _this.L.find('tr').eq(i).addClass('over');
                    }).on('mouseout',function(){
                        $(this).removeClass('over');
                        _this.L.find('tr').eq(i).removeClass('over');
                    });
                }).end().find('tr:first').children().each(function(i){
                    $(this).width(_this.cellWidth[col+i]);
                });
            };
            if(bottom){
                this.M.html(bottom).appendTo(this.wrapper).css({
                    'top':tHeight,
                    'left':wleft,
                    'width':wright
                }).find('tr').each(function(i){
                    $(this).children(':first').height(_this.cellHeight[row+i]);
                    $(this).on('mouseover',function(){
                        $(this).addClass('over');
                        _this.L.find('tr').eq(i).addClass('over');
                    }).on('mouseout',function(){
                        $(this).removeClass('over');
                        _this.L.find('tr').eq(i).removeClass('over');
                    });
                }).end().find('tr:first').children().each(function(i){
                    $(this).width(_this.cellWidth[col+i]);
                });
            };

            this.target.css({'position':'absolute','top':'-999999px'});
        },
        reset:function(){
            this.fixed(this.oldFixedRows,this.oldFixedCols);
        },
        sort:function(target){
            this.target.find('input').each(function(){
                console.log(this);
            })
            var rule = sortRule[target.data('sort-rule')],order = target.data('sort-order') || 1,fn = target.data('sort-fn');
            var index = target.index(),$rows = $.makeArray(this.target.find('tbody').children('tr'));
            var i=0,len=$rows.length,fragment = document.createDocumentFragment();
            var parentIndex = target.closest('tr').index();
            index += this.set.fixedCols
            $rows.sort(function(tr1,tr2){
                var v1 = $(tr1).children().eq(index).text(),v2 = $(tr2).children().eq(index).text();
                if($.isFunction(fn)){
                    return order * ( rule ? fn(rule(v1),rule(v2)) : fn(v1,v2));
                }else{
                    return order * (rule ? ( rule(v1) > rule(v2) ? 1 : -1) : ( v1 > v2 ? 1 : -1));
                };
            });
            this.target.find('tr').eq(parentIndex).children().eq(index).data('sort-order',-1*order).toggleClass('sort-order-inverted');
            for(;i<len;i++) fragment.appendChild($rows[i]);
            this.target.find('tbody').append(fragment);
            this.set.target = this.target;
            this.init();
        }
    };
    tableGrid.prototype.init.prototype = tableGrid.prototype;
    window.tableGrid = tableGrid;
    /*************************************************************/
    function sum(arr){
        var i=0,len=arr.length,re=0;
        for(;i<len;i++){
            re += (isNaN(arr[i]) ? 0 : arr[i]-0);
        };
        return re;
    };
    function getWidth(obj,f){
        var $obj = $(obj),c = f ? (parseInt($obj.css('paddingLeft'))+parseInt($obj.css('paddingRight'))+(parseInt($obj.css('border-left-width'))||0)+(parseInt($obj.css('border-right-width')) || 0)) : 0;
        return obj.offsetWidth-c;
    };
    function getHeight(obj,f){
        var $obj = $(obj),c = f ? (parseInt($obj.css('paddingTop'))+parseInt($obj.css('paddingBottom'))+(parseInt($obj.css('border-top-width'))||0)+(parseInt($obj.css('border-bottom-width')) || 0)) : 0;
        return obj.offsetHeight-c
    };
});