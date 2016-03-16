// 动画结束事件
var animationEnd = (function() {
	var explorer = navigator.userAgent;
	if (~explorer.indexOf('WebKit')) {
		return 'webkitAnimationEnd';
	}
	return 'animationend';
})();


function doorAction(left, right, time) {
	var $door = $('.door');
	var doorLeft = $('.door-left');
	var doorRight = $('.door-right');
	var defer = $.Deferred();
	var count = 2;
	//等待开门

	var complete = function() {
		if (count == 1) {
			defer.resolve();
			return;
		}

		count--;
	};

	doorLeft.transition({
		'left': left
	}, time, complete);
	doorRight.transition({
		'left': right
	}, time, complete);

	return defer;

}

//开门
function openDoor() {
	return doorAction('-50%', '100%', 2000);
}

function shutDoor() {
	return doorAction('0%', '50%', 2000);
}


//灯动画
var lamp = {
	elem: $('.b_background'),
	bright: function() {
		this.elem.addClass('lamp_bright');
	},
	dark: function() {
		this.elem.removeClass('lamp_bright')
	}
};



function BoyWalk() {

	var container = $('#content');

	//页面可视区域
	var visualWidth = container.width();
	var visualHeight = container.height();

	var swipe = Swipe(container);
	//获取数据
	var getValue = function(className) {
		var $elem = $('' + className + '');
		//走路的路线坐标
		return {
			height: $elem.height(),
			top: $elem.position().top
		};
	};

	//路的Y轴
	var pathY = function() {
		var data = getValue('.a_background_middle');
		return data.top + data.height / 2;
	}();

	var $boy = $('#boy');
	var boyWidth = $boy.width();
	var boyHeight = $boy.height();

	//修正小男孩的位置
	$boy.css({
		top: pathY - boyHeight + 25
	});


	//动画处理
	function pauseWalk() {
		$boy.addClass('pauseWalk');
	}
	//恢复走路
	function restoreWalk() {
		$boy.removeClass('pauseWalk');
	}

	//css3的动作变化
	function slowWalk() {
		$boy.addClass('slowWalk');
	}

	//计算移动距离
	function calculateDist(direction, proportion) {

		return (direction == "x" ? visualWidth : visualHeight) * proportion;
	}


	//用transition 做运动
	function startRun(options, runTime) {
		var dfdPlay = $.Deferred();
		//恢复走路
		restoreWalk();
		//运动的属性
		$boy.transition(
			options,
			runTime,
			'linear',
			function() {
				dfdPlay.resolve();
			});
		return dfdPlay;
	}


	//开始走路
	function walkRun(time, distX, distY) {
		time = time || 3000;
		//脚动作
		slowWalk();
		//开始走路
		var d1 = startRun({
			'left': distX + 'px',
			'top': distY ? distY : undefined
		}, time);
		return d1;
	}

	//走进商店
	function walkToShop(runTime) {
		var defer = $.Deferred();
		var doorObj = $('.door');
		//门的坐标
		var offsetDoor = doorObj.offset();
		var doorOffsetLeft = offsetDoor.left;

		//当前小孩的坐标
		var offsetBoy = $boy.offset();
		var boyOffsetLeft = offsetBoy.left;

		//当前需要移动的坐标
		instanceX = (doorOffsetLeft + doorObj.width() / 2) - (boyOffsetLeft + $boy.width() / 2);

		//开始走路
		var walkPlay = startRun({
			transform: 'translate(' + instanceX + 'px), scale(0.3, 0.3)',
			opacity: 0.1
		}, 2000);

		//走路完毕
		walkPlay.done(function() {
			$boy.css({
				opacity: 0
			})
			defer.resolve();
		});
		return defer;
	}

	//走出店
	function walkOutShop(runTime) {
		var defer = $.Deferred();
		restoreWalk();
		//开始走路
		var walkPlay = startRun({
			transform: 'translateX(' + instanceX + 'px)， scale(1, 1)',
			opacity: 1
		}, runTime);
		walkPlay.done(function() {
			defer.resolve();
		});
		return defer;
	}

	function takeFlower() {
		//增加延时等待效果
		var defer = $.Deferred();
		setTimeout(function() {
			$boy.addClass('slowFlowerWalk');
			defer.resolve();
		}, 1000);
		return defer;
	}


	return {
		//开始走路
		walkTo: function(time, proportionX, proportionY) {

			var distX = calculateDist('x', proportionX);
			var distY = calculateDist('y', proportionY);
			return walkRun(time, distX, distY);
		},
		//走进商店
		toShop: function() {
			return walkToShop.apply(null, arguments);
		},
		//走出商店
		outShop: function() {
			return walkOutShop.apply(null, arguments);
		},

		//停止走路
		stopWalk: function() {

			pauseWalk();
		},
		setColor: function(value) {

			$boy.css('background-color', value);
		},
		takeFlower: function() {
			return takeFlower();
		},
		getWidth: function() {
			return $boy.width();
		},
		//复位初始状态
		resetOriginal: function() {
			this.stopWalk();
			$boy.removeClass('slowWalk slowFlowerWalk').addClass('boyOriginal');
		},
		rotate: function(callback) {
			restoreWalk();
			$boy.addClass('boy-rotate');
			//监听转身完毕
			if (callback) {
				$boy.on(animationEnd, function() {
					callback();
					$(this).off();
				});
			}
		},
		setFlowerWalk: function() {
			$boy.addClass('slowFlowerWalk');
		}

	}
}



var container = $('#content');
var visualWidth = container.width();
var visualHeight = container.height();
var swipe = Swipe(container);
//页面按比例滚动
function scrollTo(time, proportionX) {
	var distx = container.width() * proportionX;
	swipe.scrollTo(distx, time);
}
var instanceX;
var boy = BoyWalk();

var bird = {
	elem: $('.bird'),
	fly: function() {
		this.elem.addClass('birdFly');
		this.elem.transition({
			right: container.width()
		}, 15000, 'linear');
	}
};

var getValue = function(className) {
	var $elem = $('' + className + '');

	// 走路的路线坐标
	return {
		height: $elem.height(),
		top: $elem.position().top
	};
};

//桥的Y轴
var bridgeY = function() {
	var data = getValue('.c_background_middle');
	return data.top;
}();


//小女孩
var girl = {
	elem: $('.girl'),
	getHeight: function() {
		return this.elem.height();
	},
	rotate: function() {
		this.elem.addClass('girl-rotate');
	},
	setPosition: function() {
		this.elem.css({
			left: visualWidth / 2,
			top: bridgeY - this.getHeight()
		});
	},
	getPositon: function() {
		return this.elem.offset();
	},
	getWidth: function() {
		return this.elem.width();
	}
};

var logo = {
	elem: $('.logo'),
	run: function() {
		this.elem.addClass('logolightSpeedIn')
			.on(animationEnd, function() {
				$(this).addClass('logoshake').off();
			});
	}
};

var snowflakeURI = [
	'images/snowflake/snowflake1.png',
	'images/snowflake/snowflake2.png',
	'images/snowflake/snowflake3.png',
	'images/snowflake/snowflake4.png',
	'images/snowflake/snowflake5.png',
	'images/snowflake/snowflake6.png'
]

//飘雪花
function snowflake() {
	var $flakeContainer = $('#snowflake');

	//随机六张图
	function getImagesName() {
		return snowflakeURI[[Math.floor(Math.random() * 6)]];
	}

	//创建一个雪花元素
	function createSnowBox() {
		var url = getImagesName();
		return $('<div class="snowBox" />').css({
			'width': 41,
			'height': 41,
			'position': 'absolute',
			'backgroundSize': 'cover',
			'z-index': 10000,
			'top': '-41px',
			'background-image': 'url(' + url + ')'
		}).addClass('snowRoll');
	}

	setInterval(function() {
		//运动的轨迹
		var startPositionLeft = Math.random() * visualWidth - 100,
			startOpacity = 1,
			endPositionTop = visualHeight - 40,
			endPositionLeft = startPositionLeft - 100 + Math.random() * 500;
		duration = visualHeight * 10 + Math.random() * 5000;
		//随机透明度，不小于0.5
		var randomStart = Math.random();
		randomStart = randomStart < 0.5 ? startOpacity : randomStart;

		var $flake = createSnowBox();

		//设计起点位置
		$flake.css({
			left: startPositionLeft,
			opacity: randomStart
		});
		$flakeContainer.append($flake);

		$flake.transition({
			top: endPositionTop,
			left: endPositionLeft,
			opacity: 0.7
		}, duration, 'ease-out', function() {
			$(this).remove();
		});


	}, 200);
}


var audioConfig = {
	enable: true,
	playURl: 'http://www.imooc.com/upload/media/happy.wav', // 正常播放地址
	cycleURL: 'http://www.imooc.com/upload/media/circulation.wav' // 正常循环播放地址
};

//背景音乐
function Html5Audio(url, isloop) {
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


var audio1 = Html5Audio(audioConfig.playURl);
audio1.end(function() {
	Html5Audio(audioConfig.cycleURL, true);
});


	//开始第一次走路
	$("#sun").addClass('rotation');
	$(".cloud1").addClass('cloud1Anim');
	$(".cloud2").addClass('cloud2Anim');
	boy.walkTo(6000, 0.6)
		.then(function() {
			//第一次走路完成
			scrollTo(6500, 1);
			return boy.walkTo(6500, 0.5);
			
		})
		.then(function () {
			bird.fly()
		})
		.then(function () {
			return boy.stopWalk();
		})
		.then(function () {
			 return openDoor();	
		})
		.then(function () {
			lamp.bright()
			//进商店
			return boy.toShop(1500)
		})
		.then(function() {
			return boy.takeFlower();
		})
		.then(function() {
			//出商店
			lamp.dark()
			return boy.outShop(1500)
		})
		.then(function() {
			//第二次走路完成
			girl.setPosition();
			scrollTo(6500, 2);
			return boy.walkTo(6500, 0.15);
			
		})
		.then(function() {
			// 第二次走路到桥上left,top
			return boy.walkTo(2000, 0.25, (bridgeY - girl.getHeight()) / visualHeight);
		})
		.then(function() {
			// 实际走路的比例
			var proportionX = (girl.getPositon().left - boy.getWidth() + girl.getWidth()/5) / visualWidth;
			// 第三次桥上直走到小女孩面前
			return boy.walkTo(2000, proportionX);
		})
		.then(function() {
			// 图片还原原地停止状态
			boy.resetOriginal();
		})
		.then(function() {
			setTimeout(function() {
				girl.rotate();
				boy.rotate(function() {
					logo.run();
					snowflake();
				});
			}, 1000);
		});
