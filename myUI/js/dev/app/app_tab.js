/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){
    require('../module/tab');
    var tabAjax = require('../module/tabAjax');

    //普通tab切换
    $('#J_tab').tab({
        tabClass:'.tab_trigger li a',
        conClass:'.tab_cont_item',
        activeClass:'current'
    });

    //Ajax tab切换
    tabAjax({
        target:'#J_tabAjax',
        tab:'li a',
        con:'#J_tabAjax_cont .tab_cont_item',
        activeClass:'current'        
    });
});