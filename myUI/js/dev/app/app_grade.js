/**
 * User   : zhanglong
 * QQ     : 727701838
 * Email  : yinique@126.com
 * Github : https://github.com/tiomll
 */
define(function(require,exports,module){
    var grade = require('../module/grade');
    require('../module/grade2');
    
    grade({
        msg:[
            "很不满意|差得太离谱，与卖家描述的严重不符，非常不满",
            "不满意|部分有破损，与卖家描述的不符，不满意",
            "一般|质量一般，没有卖家描述的那么好",
            "满意|质量不错，与卖家描述的基本一致，还是挺满意的",
            "非常满意|质量非常好，与卖家描述的完全一致，非常满意"
        ]
    });

    //评分
    var $J_grade_number = $('#J_grade_number em');
    var hanndler = function(v){
        $J_grade_number.text(v);
    };
    $('#J_to_grade').grade({
        save:'#J_grade',
        half: true,
        callback:hanndler,
        moveHandler:hanndler,
        outHandler:hanndler
    });
});