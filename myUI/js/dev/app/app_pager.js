/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){
    require('../module/pager');
    require('../module/dialog');
    
    $('#J_pager1').pager();
    $('#J_pager2').pager({asyn:1});
    $('#J_pager3').pager({
        asyn:1,
        showNum:1, // 是否显示页数
        showForm:0, //是否显示跳转表单
        showPrevAndNext:0 //是否显示上一页，下一页
    });
    $('#J_pager4').pager({
        asyn:1,
        showNum:0, // 是否显示页数
        showForm:0, //是否显示跳转表单
        showPrevAndNext:1 //是否显示上一页，下一页
    });
    $('#J_pager5').pager({
        asyn:1,
        showNum:0, // 是否显示页数
        showForm:1, //是否显示跳转表单
        showPrevAndNext:0 //是否显示上一页，下一页
    });
    $('#J_pager6').pager({
        asyn:1,
        showNum:1, // 是否显示页数
        showForm:0, //是否显示跳转表单
        showPrevAndNext:1 //是否显示上一页，下一页
    });
    $('#J_pager7').pager({
        asyn:1,
        showNum:1, // 是否显示页数
        showForm:1, //是否显示跳转表单
        showPrevAndNext:0 //是否显示上一页，下一页
    });
    $('#J_pager8').pager({
        asyn:1,
        showNum:0, // 是否显示页数
        showForm:1, //是否显示跳转表单
        showPrevAndNext:1 //是否显示上一页，下一页
    });
    $('#J_pager9').pager({
        asyn:1,
        size:7
    });
    $('#J_pager10').pager({
        asyn:1,
        size:5
    });
    $('#J_pager11').pager({
        asyn:1
    });
});