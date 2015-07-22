/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){
    $.fn.security = function(opts){
        var set = $.extend({
            target:'',
            maxlength:'',
            minlength:'',
            S:'',  //强
            M:'',  //中
            W:''  //弱
        },opts||{});
        var _this = $(this), T = $(set.target), max = set.maxlength, min = set.minlength, s = set.S, m = set.M, w = set.W;

        _this.on('keyup', function(){
            var v = _this.val();
            if(!v){ 
                T.removeAttr('class');
            }else{ 
                var vl = checkLength(v);
                switch(vl){ 
                    case 1:
                        T.attr('class', w);
                    break;
                    case 2:
                        T.attr('class', m);
                    break;
                    case 3:
                        T.attr('class', s);
                    break;
                    default:
                        T.removeAttr('class');
                }
            }
        });
        //判断输入字符长度
        function checkLength(v) { 
            var n = f = t = false, l = 0, j, len = v.length;
            if(len < min || len > max){ 
                l = -1;
            }else{ 
                for(i=0; i<len; i++){ 
                    j = checkStr(v.charCodeAt(i));

                    if( j==1 && n==false ){ 
                        l += 1;
                        n = true;
                    }
                    if( ( j==2 || j==3 ) && f==false ){ 
                        l += 1;
                        f = true;
                    }
                    if( j==4 && t==false ){ 
                        l += 1;
                        t = true;
                    }
                }
            }
            return l;
        }
        //判断输入字符类型
        function checkStr(b) { 
            if( b>=48 && b<=57 ){
                return 1; //数字
            }else if( b>=65 && b<=90 ){
                return 2; //大写字母
            }else if( b>=97 && b<=122 ) {
                return 3; //小写字母
            }else{
                return 4; //特殊字符
            }
        }
    }
});