var boy=boyWalk();
var container=$('#content');



//第二场景中门的动画
function doorAction(left,right,time){
    var doorLeft=$('.door-left');
    var doorRight=$('.door-right');
    var defer=$.Deferred();
    var count=2;
    //监听两个事件全部完成
    var complete=function(){
        if(count==1){
            defer.resolve();
            return;
        };
        count--;
    };
    doorLeft.transition(
        {'left':left},time,complete);
    doorRight.transition(
        {'right':right},time,complete);
    return defer;
}

function openDoor(){
    return doorAction('-50%','-50%',2000);
}

function shutDoor(){
    return doorAction('0%','0%',2000);
}
//第二场景中灯
var lamp={
    element:$('.shopping'),
    bright:function(){
        this.element.addClass("lamp-bright")
    },
    dark:function(){
        this.element.removeClass("lamp-bright")
    }
};
//第二场景中的鸟
var bird={
    element:$('.bird'),
    fly:function(){
        this.element.addClass('birdFly');
        this.element.transition({'right':$('#content').width()},15000,'linear')
    }
};
//定义女孩的动作
var girl={
    elem:$(".girl"),
    rotate:function(){
        this.elem.addClass("girl-rotate");
    }
};
//logo的动画

var logo={
    elem:$('.logo'),
    run:function(){
        this.elem.addClass('logoLightSpeedIn')
        .on('animationend',function(){
            $(this).addClass('logoShake').off();
        });
    }
};

//第三场景雪花
//图片库
var snowURL=[
'images/snowflake1.png',
'images/snowflake2.png',
'images/snowflake3.png',
'images/snowflake4.png',
'images/snowflake5.png',
'images/snowflake6.png'];
//雪花飘落
//问题：怎么来判断此雪花可以进行循环操作？
function snowFalling(){
    var $snowContainer=$('.snow');
    function creatSnowBox(){
    //从图片库中选择一张图片，创建新元素，添加样式和动画
        var url=snowURL[[Math.floor(Math.random()*6)]];
        return $('<div class="snowbox"/>').css({
            'width':41,
            'height':41,
            'position':'absolute',
            'backgroundImage':'url('+url+')',
            'top':-41,
            'backgroundSize':'cover'
        }).addClass('snowRoll');
    };
    var startTime = new Date().getTime();
    //200ms飘落雪花
    setInterval(function(){
        var startLeft=Math.random()*width-100;
            startOpacity=1;
            endTop=height-40;
            endleft=startLeft-100+Math.random() * 500;
            duration=8000+Math.random() * 5000;
        var random=Math.random() ;
        var randomOpacity=random<0.5?startOpacity:random;
        var $snowFall=creatSnowBox();
        $snowFall.css({
            left:startLeft,
            opacity:randomOpacity
        });
        $snowContainer.append($snowFall);
        //20s后雪花飘落结束
        if(new Date().getTime() - startTime > 20000){
            clearInterval();
            return;}
        //飘落的设置
        $snowFall.transition({
            left:endleft,
            top:endTop,
            opacity:0.7
        },duration,'ease-out',function(){
            $(this).remove();})
    },200);
};
// 音乐配置
var audioConfig = {
    playURl: 'music/happy.wav', // 正常播放地址
    cycleURL: 'music/circulation.wav' // 正常循环播放地址
};

//背景音乐 //
function Hmlt5Audio(url, isloop) {
    var audio = new Audio(url);
    audio.autoPlay = true;
    audio.loop = isloop || false;
    audio.play();
    return {
        end: function(callback) {
            audio.addEventListener('ended', function() {
                callback();
            }, false);
        }
    };
}


//所有动画设置关键帧
//通过window.onload控制小男孩的行为
$(function(){
//音乐控制
    var audio1 = Hmlt5Audio(audioConfig.playURl);
    audio1.end(function() {
        Hmlt5Audio(audioConfig.cycleURL, true);
    });
//太阳公转
    $('.sun').addClass('rotation');
    $('.cloud1').addClass('translate1');
    $('.cloud2').addClass('translate2');
 //开始走路，2s的时候走到页面的20%处
 boy.walkTo(2000,0.3)
 .then(function(){
   //小男孩走到页面的20%时，页面翻页:5s中平移一个页面宽度
   swipe.scrollTo(container.width(),5000);
 }).then(function(){
   //页面翻页的同时小男孩继续走：5s的时候走到页面的50%的位置
   return boy.walkTo(5000,0.5);
 }).then(function(){
 //小男孩停止走路
    boy.stopWalk(); 
 }).then(function(){
 //小男孩停止走路的同时，门打开
 bird.fly();
 return openDoor();
 }).then(function(){
 //打开门之后更换为灯亮的背景
     lamp.bright();
 }).then(function(){
 //小男孩走进商店
   return boy.toShop(2000);
 }).then(function(){
 //小男孩在商店停留1秒钟拿花
   return boy.takeFlower();
 }).then(function(){
 //小男孩出商店
    return boy.outShop(2000);
 }).then(function(){
 //商店关门
     shutDoor();
     lamp.dark(); 
 }).then(function(){
 //页面三滚动
     swipe.scrollTo($("#content").width()*2,5000)
 }).then(function(){
 //小男孩走到桥下
     return boy.walkTo(5000,0.15);
 }).then(function(){
 //小男孩上桥到与小女孩相同的高度
     var proportionY=$('.girl').position().top/height;
     return boy.walkTo(3000,0.25,proportionY);
 }).then(function(){
 //获取女孩的位置，走到桥上和女孩相遇
     var proportionX=($('.girl').offset().left-$('#boy').width()+$('.girl').width()/5)/width;
     return boy.walkTo(2000,proportionX)
 }).then (function(){
 //男孩暂停，即雪碧图停止滑动，并保持最后一个动作不变
     boy.resetOriginal();
 }).then(function(){
 //男孩和女孩同时转身
     return boy.rotation();
 }).then(function(){
 //男女孩转身后logo出现
     return logo.run();
 }).then(function(){
//雪花飘落
     snowFalling();
 });
});