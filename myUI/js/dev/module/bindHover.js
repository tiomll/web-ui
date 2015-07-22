define(function(require,exports,module){
    $(document).on('mouseenter','*[data-hover]',function(){
        $(this).addClass($(this).data('hover'));
    }).on('mouseleave','*[data-hover]',function(){
        $(this).removeClass($(this).data('hover'));
    });
});