function boyWalk(){
	var $boy=$('#boy');
	//将百分比转换为像素
	function calculateDist(direction,proporation){
		return (direction=="x"?width:height)*proporation;
	};
	//原地踏步

	function slowWalk(){
		$boy.addClass('slowWalk');
	};
	//小男孩停止走路
	function stopwalk(){
		$boy.addClass("pauseWalk");
	};
	//小男孩回复走路
	function removeWalk(){
		$boy.removeClass("pauseWalk");
	};
	//进行行走
	function startRun(options,time){
		var defer=$.Deferred();
		//移除小男孩停止走路的命令
		removeWalk();
		$boy.transition(options,time,'linear',function(){
			defer.resolve();
		});
		return defer;
	};
	//如何进行行走的方法
	function walkRun(time,disx,disy){
		var time=time;
		slowWalk();
		var d1=startRun({
			'left':disx+'px',
			'top':disy?disy:undefined},time);
		return d1;
	};
//商店有关

	  //走进商店
	function walkToShop(runtime){
		var defer=$.Deferred();
       //获取门left位置
	   var doorObj = $('.doors');
	   //门的坐标
	   var doorOffsetLeft = doorObj.offset().left;
	   //boy当前的坐标
	   var boyOffsetLeft = $('.charactor').offset().left;

	   //当前需要移动坐标                  
	    instanceX = (doorOffsetLeft + doorObj.width() /2) - (boyOffsetLeft + $boy.width() / 2);

		//进行开始走路
		var walkPlay=startRun({
			'transform':'translateX('+instanceX+'px) scale(0.3,0.3)',
			'opacity':0.1
		},runtime);
		//完成时小男孩消失了
		walkPlay.done(
		  function(){
			$boy.css({opacity:0});
			defer.resolve()
		});
		return defer;
	};
	//小男孩走出商店
	function walkOutShop(runtime){
		var defer=$.Deferred();
		var walkPlay=startRun({
			'transform':'translateX('+instanceX+'px) scale(1,1)',
			'opacity':1
		},runtime);
		walkPlay.done(function(){
			defer.resolve();
		});
		return defer;
	};
	//男孩在商店停留1秒钟后拿花
	function takeAFlower(){
		var defer=$.Deferred();
		setTimeout(function(){
			$boy.removeClass('slowWalk').addClass('slowFlowerWalk');
			defer.resolve();
		},1000)
		return defer;
	};
	
	//男孩女孩转圈
	function allRotation(){
		var defer=$.Deferred();
		setTimeout(function(){
			$boy.removeClass('pauseWalk').addClass('boyrotation');
			girl.rotate();
			defer.resolve();
		},2000);
			return defer;
	}


	//调用此函数的属性和方法级
	return{
		walkTo:function(time,proporationX,proporationY){
			var distx=calculateDist('x',proporationX);
			var disty=calculateDist('y',proporationY);
			return walkRun(time,distx,disty);
		},
		stopWalk:function(){
		   return stopwalk();
		},
//为什么walkToShop和walkOutShop要加上apply呢？
		toShop:function(){
			return walkToShop.apply(null,arguments);
		},
		outShop:function(){
			return walkOutShop.apply(null,arguments);
		},
		takeFlower:function(){
			return takeAFlower();
		},
		resetOriginal:function(){
			this.stopWalk();
			return $boy.removeClass('slowWalk slowFlowerWalk').addClass('boyOriginal');
		},
		rotation:function(){
			return allRotation();
		},
	}
}