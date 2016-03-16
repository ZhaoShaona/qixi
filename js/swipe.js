///页面滑动

function Swipe(container) {
	
	//滑动对象
	var swipe = {};
	var element = container.find(":first");
	var slides = element.find('>');
	var width = container.width();
	var height = container.height();
    //设置总宽度
	element.css({
		width: (slides.length * width) + 'px',
		height: height + 'px'
	});
    //设置每个li宽度
	$.each(slides, function (index) {
		var slide = slides.eq(index);
		slide.css({
			width: width + 'px',
			height: height + 'px'
		});
	});

	//监控完成与移动
	swipe.scrollTo = function (x, speed) {
		//执行动画移动
		element.css({
			'transition-timing-function': 'linear',
			'transition-duration': speed + 'ms',
			'transform': 'translate3d(-' + x + 'px, 0px, 0px)'
			//'transform': 'translateX(-' + (width * 2) + 'px)'
		});
		return this;
	}

	return swipe;
}