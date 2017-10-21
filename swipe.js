
    //为什么要加这句话？
    //声明swipe这个变量的
    var container=$('#content');
    var element = $('.content-wrap');
    var slides = element.find("li");
//在页面显示中，宽度和高度均为父容器的宽和高
    var width = container.width();
    var height = container.height();
//设置ul的页面，即整个li的页面
    element.css({
        width:(slides.length * width) + 'px',
        height:height + 'px'
    });
//设置每一个li的页面
    $.each(slides, function (index) {
        var slide = slides.eq(index);
        slide.css({
            width:width + 'px',
            height:height + 'px'
        });
    });
    //监控完成和移动
    var swipe={};
    swipe.scrollTo=function (x,speed) {
        element.css({
            //为什么要加引号？
            'transition-timing-function':'linear',
            'transition-duration':speed+'ms',
            'transform':'translate3d(-'+ x +'px,0px,0px)'
        });
        return this;        /*return transition({'right':x},speed,complete);*/
        };
