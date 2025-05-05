function BgMusic(options){
	var audio = document.createElement('audio');
	audio.src = options.src;
	audio.loop = "loop";
	audio.autoplay = true;
	audio.id = 'createBgAudio';
	document.body.appendChild(audio);
	document.getElementById('createBgAudio')

	this.audio = audio;
	var isHandle = false;	//用户和页面首次交互
	function testAutoPlay(){
		// 返回一个promise以告诉调用者检测结果
		return new Promise(resolve => {
			var autoplay;
			audio.play().then(() => {//支持自动播放
				autoplay = true;
				options.on && options.on();
			}).catch(err => {//不支持自动播放
				autoplay = false;
				options.off && options.off();
			}).finally((e) => {
				resolve(autoplay);
			});
		});
	}
	testAutoPlay().then(autoplay => {
		if(!autoplay){
			//用户没有和页面有过任何交互时，绑定触发事件
			if(!isHandle){
				setAutoPlayWhenClick();
			}
		}
	});
	function setAutoPlayWhenClick(){
		function setAutoPlay(){
			isHandle = true;
			testAutoPlay();	//继续尝试播放
			document.removeEventListener('click', setAutoPlay);
			document.removeEventListener('touchend', setAutoPlay);
		}
		
		var ua = window.navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i) == 'micromessenger'){//如果是微信，等WeixinJSBridgeReady后继续尝试播放
        	document.addEventListener('WeixinJSBridgeReady', ()=>{
    			testAutoPlay();
        	});
		}else{//绑定触发方法
			document.addEventListener('click', setAutoPlay);
			document.addEventListener('touchend', setAutoPlay);
		}
	}
}
