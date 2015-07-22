/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){
    $.fn.imgSlider = function(opts){
        var set=$.extend({
            prev: '#J_prev',
            next: '#J_next',
            item: '#J_slidercont li'
        },opts||{});
        var _this = $(this), $prev = $(set.prev, _this), $next = $(set.next, _this), $item = $(set.item, _this), $itemInit = [], isIE6 = !window.XMLHttpRequest;

        $item.each(function(i) {
            $itemInit[i] = {};
            $(this).css({
                'position': 'absolute',
                'width': ($itemInit[i].w = $(this).find('img').width()),
                'height': ($itemInit[i].h = $(this).find('img').height()),
                'top': ($itemInit[i].t = $item.eq(i).position().top),
                'left': ($itemInit[i].l = $item.eq(i).position().left),
                'z-index': ($itemInit[i].z = 1),
                'alpha': ($itemInit[i].alpha = 0)
            });
            $(this).find('span').css('alpha', ($itemInit[i].salpha = 0));
            $(this).find('a').data('seat', ($itemInit[i].seat = ''));
            switch (i) {
                case 1:
                    $(this).css({'z-index': ($itemInit[1].z = 2), 'alpha': ($itemInit[1].alpha = 100)});
                    $(this).find('a').data('seat', ($itemInit[1].seat = 'left'));
                    $(this).find('span').css('alpha', ($itemInit[1].salpha = 80));
                    break;
                case 2:
                    $(this).css({'z-index': ($itemInit[2].z = 3), 'alpha': ($itemInit[2].alpha = 100)});
                    $(this).find('a').data('seat', ($itemInit[2].seat = 'left'));
                    $(this).find('span').css('alpha', ($itemInit[2].salpha = 50));
                    break;
                case 3:
                    $(this).css({'z-index': ($itemInit[3].z = 4), 'alpha': ($itemInit[3].alpha = 100)});
                    $(this).find('a').data('seat', ($itemInit[3].seat = ''));
                    $(this).find('span').css('alpha', ($itemInit[3].salpha = 0));
                    break;
                case 4:
                    $(this).css({'z-index': ($itemInit[4].z = 3), 'alpha': ($itemInit[4].alpha = 100)});
                    $(this).find('a').data('seat', ($itemInit[4].seat = 'right'));
                    $(this).find('span').css('alpha', ($itemInit[4].salpha = 50));
                    break;
                case 5:
                    $(this).css({'z-index': ($itemInit[5].z = 2), 'alpha': ($itemInit[5].alpha = 100)});
                    $(this).find('a').data('seat', ($itemInit[5].seat = 'right'));
                    $(this).find('span').css('alpha', ($itemInit[5].salpha = 80));
                    break;
                // default:
                //     break;
            }
            
            $(this).find('a').on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var seat = $(this).data('seat');
                if (seat == 'left') {
                    gotoImg(true);
                    return;
                } else if (seat == 'right') {
                    gotoImg(false);
                    return;
                } else {
                    var dome = createElements(this.href, this.getElementsByTagName('img')[0].alt);
                    setCenter(dome);
                    document.onclick = function () {
                        var db = document.body;
                        db.removeChild(dome.overlayer);
                        db.removeChild(dome.contentOuter);
                        window.CollectGarbage && setTimeout(window.CollectGarbage, 1);
                    }
                }
            });
        });

        $prev.on('click', function(e) {
            e.preventDefault();
            gotoImg(true);
        });

        $next.on('click', function(e) {
            e.preventDefault();
            gotoImg(false);
        });

        function gotoImg(f) {
            if(f) {
                $itemInit.push($itemInit.shift());
            } else {
                $itemInit.unshift($itemInit.pop());
            }

            $item.each(function(i) {
                startMove($item[i], {left: $itemInit[i].l, top: $itemInit[i].t, width: $itemInit[i].w, height: $itemInit[i].h, alpha: $itemInit[i].alpha, salpha: $itemInit[i].salpha, zIndex: $itemInit[i].z, seat: $itemInit[i].seat}, 300);
            });
        };

        function startMove(obj, oParams, iTime) {
            var iInterval = 45, iEndTime = (new Date()).getTime() + iTime, iTimes = Math.ceil(iTime / iInterval), oSpeed = {};

            if (typeof obj.timer == 'undefined') {
                obj.timer = null;
            }

            for (key in oParams) {
                oSpeed[key] = (oParams[key] - obj[key]) / iTimes;
            }

            if (obj.timer) {
                clearInterval(obj.timer);
            }
            obj.timer = setInterval(
                function() {
                    doMove(obj, oParams, oSpeed, iEndTime);
                }, iInterval
            );
        }

        function doMove(obj, oTarget, oSpeed, iEndTime) {
            var iNow = (new Date()).getTime();

            if (iNow >= iEndTime) {
                clearInterval(obj.timer);
                obj.timer = null;

                for (key in oTarget) {
                    obj[key] = oTarget[key];

                    switch (key) {
                        case 'alpha':
                            obj.style.opacity = oTarget[key] / 100;
                            obj.style.filter = "alpha(opacity:" + oTarget[key] + ")";
                            break;
                        case 'salpha':
                            obj.getElementsByTagName('span')[0].style.opacity = oTarget[key] / 100;
                            obj.getElementsByTagName('span')[0].filter = "alpha(opacity:" + oTarget[key] + ")";
                            break;
                        case 'zIndex':
                            obj.style.zIndex = oTarget[key];
                            break;
                        case 'width':
                            obj.style[key] = oTarget[key] + 'px';
                            obj.getElementsByTagName('img')[0].style[key] = oTarget[key] + 'px';
                            obj.getElementsByTagName('span')[0].style[key] = oTarget[key] + 'px';
                            break;
                        case 'height':
                            obj.getElementsByTagName('img')[0].style[key] = oTarget[key] + 'px';
                            obj.getElementsByTagName('span')[0].style[key] = oTarget[key] + 'px';
                            break;
                        case 'seat':
                            obj.getElementsByTagName('a')[0].setAttribute('data-seat', oTarget[key]);
                            break;
                        default:
                            obj.style[key] = oTarget[key] + 'px';
                            break;
                    }
                }
            } else {
                for (key in oTarget) {
                    obj[key] += oSpeed[key];

                    switch (key) {
                        case 'alpha':
                            obj.style.opacity = obj[key] / 100;
                            obj.style.filter = "alpha(opacity:" + obj[key] + ")";
                            break;
                        case 'salpha':
                            obj.getElementsByTagName('span')[0].style.opacity = obj[key] / 100;
                            obj.getElementsByTagName('span')[0].filter = "alpha(opacity:" + obj[key] + ")";
                            break;
                        case 'zIndex':
                            obj.style.zIndex = oTarget[key];
                            break;
                        case 'width':
                            obj.style[key] = obj[key] + 'px';
                            obj.getElementsByTagName('img')[0].style[key] = obj[key] + 'px';
                            obj.getElementsByTagName('span')[0].style[key] = obj[key] + 'px';
                            break;
                        case 'height':
                            obj.getElementsByTagName('img')[0].style[key] = obj[key] + 'px';
                            obj.getElementsByTagName('span')[0].style[key] = obj[key] + 'px';
                            break;
                        case 'seat':
                            obj.getElementsByTagName('a')[0].setAttribute('data-seat', obj[key]);
                            break;
                        default:
                            obj.style[key] = obj[key] + 'px';
                            break;
                    }
                }
            }
        }

        function createElements(url, alt){
            var db = document.body, h = Math.max(document.documentElement.clientHeight, document.body.offsetHeight),
                overlayer = createEl('<div style="position:absolute;top:0;left:0;width:100%;height:'+h+'px;background:#000;opacity:.5;filter:Alpha(Opacity=50);z-index:9999;"></div>',db),
                contentOuter = createEl('<div id="dialog" style="position:fixed;top:50%;left:50%;z-index:10000;"></div>',db),
                img = createEl('<div style="width:100%;height:100%;"><img src="'+url+'" alt="'+alt+'" /></div>',contentOuter);
                isIE6 && (contentOuter.style.position = 'absolute');
            return {
                overlayer:overlayer,
                contentOuter:contentOuter,
                img:img
            };
        };
        function createEl(str,parent){
            var div = document.createElement('div'), el;
            div.innerHTML = str;
            el = div.firstChild;
            return parent ? parent.appendChild(el) : el;
        };
        function setCenter(doms){
            if(!doms) return;
            var T = doms.contentOuter,w = T.offsetWidth,h = T.offsetHeight,timer = null;
            var dd = document.documentElement,W = dd.clientWidth,H = dd.clientHeight,dbh = document.body.offsetHeight; 
            var st = Math.max(dd.scrollTop,document.body.scrollTop),sl = Math.max(dd.scrollLeft,document.body.scrollLeft);
            T.style.top = (H-h)/2 + (isIE6 ? st : 0 )+'px';
            T.style.left = (W-w)/2 +(isIE6 ? sl : 0 ) + 'px';
            doms.overlayer.style.height = Math.max(H,dbh) + 'px';
            if(isIE6){
                addEvent(window,'scroll',function(){
                    if(timer) clearTimeout(timer);
                    timer = setTimeout(function(){
                        var t = Math.max(document.body.scrollTop,document.documentElement.scrollTop);
                        T.style.top = (H-h)/2+ t +'px';
                    },100);
                });
            };
        };
        function addEvent(el,type,fn){
            if(el.addEventListener != undefined){
                el.addEventListener(type,fn,false);
            }else if(el.attachEvent != undefined){
                el.attachEvent('on'+type,fn)
            }else{
                el['on'+type] = fn;
            };
        };
    };
});