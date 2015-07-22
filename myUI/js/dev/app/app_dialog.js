/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){
    //加载dialog模块
    require('../module/dialog');

    //加载bindDialog模块
    require('../module/bindDialog');
    
    $('#J_alert').on('click', function(e) {
        e.preventDefault();
        dialog.alert({
            content:'你现在测试的是alert！',
            closeCall:function(){window.location.reload();}
        });
    });

    $('#J_confirm').on('click', function(e) {
        e.preventDefault();
        dialog.confirm({
            content:'你现在测试的是confirm！',
            callback:function(v){dialog.alert({content:v?'你选择了确定！':'你选择了取消！'});}
        });
    });

    $('#J_prompt').on('click', function(e) {
        e.preventDefault();
        dialog.prompt({
            content:'你现在测试的是prompt！',
            defaultValue:'说点什么吧，亲！',
            callback:function(v){dialog.alert({content:v});}
        });
    });

    $('#J_load').on('click', function(e) {
        e.preventDefault();
        dialog.load({
            width:'700',
            height:'400',
            title:'辅导培训用户协议',
            content:'userAgree.html'
        });
    });

    $('#J_loadIframe').on('click', function(e) {
        e.preventDefault();
        dialog.loadIframe({
            width:'700',
            height:'400',
            content:'http://www.baidu.com'
        });
    });
});