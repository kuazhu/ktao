/*
* @Author: TomChen
* @Date:   2018-06-08 20:17:35
* @Last Modified by:   TomChen
* @Last Modified time: 2018-07-10 11:05:56
*/
;(function($){

	function loadHtmlOnce($elem,callBack){
		//获取需要请求的地址
		var loadUrl = $elem.data('load');
		//如果页面上没有设置请求地址直接返回
		if(!loadUrl) return;

		var isLoaded = $elem.data('isLoaded');
		//如果已经加载过数据了直接返回
		if(isLoaded) return;		
		//如果有请求地址,发送请求获取数据
		$.getJSON(loadUrl,function(data){
			console.log('get data ...',data);
			callBack($elem,data);
		});		
	}
	//获取数据一次
	function getDataOnce($elem,url,callBack){
		var data = $elem.data(url);
		if(!data){
			$.getJSON(url,function(resData){
				$elem.data(url,resData);
				callBack(resData);
			})
		}else{
			callBack(data);
		}
	}
	//加载图片
	function loadImage(url,success,error){
		var image = new Image();

		image.onload = function(){
			if(typeof success == 'function') success(url);
		}

		image.onerror = function(){
			if(typeof error == 'function') error(url);
		}

		image.src = url;		
	}
	//加载多张图片
	function loadImages($imgs,success,error){
		$imgs.each(function(){
			var $img = $(this);
			var imgUrl = $img.data('src');
			loadImage(imgUrl,function(imgUrl){
				$img.attr('src',imgUrl); 
				success();
			},function(imgUrl){
				error($img,imgUrl);
			});
		})
	}	
	//懒加载
	/*
	懒加载实例
	options = {
		totalItemNum:5
		$elem:$elem,
		eventName:'tab-show',
		eventPrefix:'tab'
	}
	*/
	function lazyLoad(options){
		var item = {},
		    totalItemNum =  options.totalItemNum,
			loadedItemNum = 0,
			loadFn = null,
			$elem = options.$elem,
			eventName = options.eventName,
			eventPrefix = options.eventPrefix;
		
		$elem.on(eventName,loadFn = function(ev,index,elem){//确定加载时机
			if(item[index] != 'loaded'){//具体加载
				$elem.trigger(eventPrefix+'-loadItem',[index,elem,function(){
					item[index] = 'loaded';
					loadedItemNum++;
					if(loadedItemNum == totalItemNum){//整个加载结束
						$elem.trigger(eventPrefix+'-loadedItems')
					}
				}])
			}
		});

		$elem.on(eventPrefix+'-loadedItems',function(){
			$elem.off(eventName,loadFn)
		});
	}	

	/*顶部下拉菜单开始*/
	var $menu = $('.nav-site .dropdown');
	
	$menu.on('dropdown-show',function(ev){
		loadHtmlOnce($(this),buildMenuItem)
	});
	//构建菜单并加重
	function buildMenuItem($elem,data){
		var html = '';
		for(var i = 0;i<data.length;i++){
			html += '<li><a href="'+data[i].url+'" class="menu-item">'+data[i].name+'</a></li>';
		}
		//模拟网络延时
		setTimeout(function(){
			$elem.find('.dropdown-layer').html(html);
			$elem.data('isLoaded',true);
		},1000);
	}
	$menu.dropdown({
		css3:true,
		js:true,
		mode:'slideUpDown'
	});

	/*顶部下拉菜单结束*/
	
	/*搜索框开始*/

	var $search = $('.search');
	
	//search插件初始化
	$search.search({
		autocomplete:true,
		getDataInterval:0
	});
	
	$search
	.on('getData',function(ev,data){
			var $this = $(this);
			var html = createSearchLayer(data,10);	
			$this.search('appendLayer',html);
			if(html){
				$this.search('showLayer');
			}else{
				$this.search('hideLayer');
			}
	})
	.on('getNoData',function(){
		$search.search('appendLayer','').search('hideLayer');
	})
	.on('click','.search-item',function(){
		$search.search('setInputVal',$(this).html());
		$search.search('submit');

	});

	function createSearchLayer(data,maxNum){
		if(data.result.length == 0){
			return '';
		}		
		var html = '';
		for(var i = 0;i<data.result.length;i++){
			if(i>=maxNum) break;
			html += '<li class="search-item">'+data.result[i][0]+'</li>'
		}
		return html;
	}
	/*搜索框结束*/	

	/*分类导航开始*/
	var $category = $('.category .dropdown');

	$category.on('dropdown-show',function(ev){

		loadHtmlOnce($(this),buildCategorItem);

	});
	function buildCategorItem($elem,data){
		var html = '';
		for(var i = 0;i<data.length;i++){
			html += '<dl class="category-details clearfix"><dt class="category-details-title fl"><a href="#" class="category-details-title-link">'+data[i].title+'</a></dt><dd class="category-details-item fl">';
			for(var j = 0;j<data[i].items.length;j++){
				html += '<a href="#" class="link">'+data[i].items[j]+'</a>'
			}
			html += '</dd></dl>';
		}
		//模拟网络延时
		setTimeout(function(){
			$elem.find('.dropdown-layer').html(html);
			$elem.data('isLoaded',true);
		},1000);		
	}

	$category.dropdown({
		css3:false,
		js:true,
		mode:'slideLeftRight'
	});

	/*分类导航结束*/

	/*中心轮播图开始*/
	var $focusCarousel = $('.focus .carousel-container');

	//中心轮播图图片具体的加载
	$focusCarousel.on('focusCarousel-loadItem',function(ev,index,elem,success){
		var $imgs = $(elem).find('.carousel-img');
		loadImages($imgs,success,function($img,url){
			$img.attr('src','images/focus-carousel/placeholder.png');
		});		
	});
	lazyLoad({
		totalItemNum:$focusCarousel.find('.carousel-img').length,
		$elem:$focusCarousel,
		eventName:'carousel-show',
		eventPrefix:'focusCarousel'		
	});

	/*调用轮播图插件*/
	$focusCarousel.carousel({
		activeIndex:0,
		mode:'slide',
		interval:0
	});

	/*中心轮播图结束*/
	
	/*今日商品开始*/
	var $todaysCarousel = $('.todays .carousel-container');

	//录播图图片的具体加载
	$todaysCarousel.on('todaysCarousel-loadItem',function(ev,index,elem,success){
		var $imgs = $(elem).find('.carousel-img');
		loadImages($imgs,success,function($img,url){
			$img.attr('src','images/focus-carousel/placeholder.png');
		});		
	});
	lazyLoad({
		totalItemNum:$todaysCarousel.find('.carousel-img').length,
		$elem:$todaysCarousel,
		eventName:'carousel-show',
		eventPrefix:'todaysCarousel'		
	});
	$todaysCarousel.carousel({
		activeIndex:0,
		mode:'slide',
	});
	/*今日商品结束*/

	/*楼层开始*/
	var $floors = $('.floor');
	//楼层图片图按需加载函数
	var $win = $(window);
	var $doc = $(document);
	function isVisible($elem){
		return ($win.height() + $win.scrollTop() > $elem.offset().top) && ($win.scrollTop() < $elem.offset().top+$elem.height())
	}
	function timeToShow(){
		$floors.each(function(index){
			if(isVisible($(this))){
				$doc.trigger('floor-show',[index,this])
			}
		})		
	}

	//楼层HTML图按需加载函数
	function buildFloorHtml(oneFloorData){
		var html = '';
		html += '<div class="container">';
		html += buildFloorHeadHtml(oneFloorData);
		html += buildFloorBodyHtml(oneFloorData);
		html += '</div>';
		return html;
	}
	function buildFloorHeadHtml(oneFloorData){
		var html = '';

		html += '<div class="floor-hd">;';
		html += '	<h2 class="floor-title fl">';
		html += '		<span class="floor-title-num">'+oneFloorData.num+'F</span>';
		html += '		<span class="floor-title-text">'+oneFloorData.text+'</span>';
		html += '	</h2>';
		html += '	<ul class="tab-item-wrap fr">';
		for(var i = 0;i<oneFloorData.tabs.length;i++){
			html +=	'<li class="fl"> <a class="tab-item" href="javascript:;">'+oneFloorData.tabs[i]+'</a></li>';
			if(i != oneFloorData.tabs.length-1){
				html +=	 '<li class="fl tab-divider"></li>';
			}
		}
		html += '	</ul>';
		html += '</div>';

		return html;
	}
	function buildFloorBodyHtml(oneFloorData){
		var html = '';
		html += '<div class="floor-bd">';
		for(var i = 0;i<oneFloorData.items.length;i++){
			html += '	<ul class="tab-panel clearfix">';
				for(var j = 0;j<oneFloorData.items[i].length;j++){
					html += '<li class="floor-item fl">';
					html += '	<p class="floor-item-pic">';
					html += '		<a href="#">';
					html += '			<img src="images/floor/loading.gif" class="floor-img" data-src="images/floor/'+oneFloorData.num+'/'+(i+1)+'/'+(j+1)+'.png" alt="">';
					html += '		</a>';
					html += '	</p>';
					html += '	<p class="floor-item-name">';
					html += '		<a class="link" href="#">'+oneFloorData.items[i][j].name+ '</a>';
					html += '	</p>';
					html += '	<p class="floor-item-price">￥'+oneFloorData.items[i][j].price+'</p>';
					html += '</li>';
				}																					
			html += '	</ul>';			
			}			
		html += '</div>';
		return html;		
	}
	
	//楼层图片的具体加载
	$floors.on('tab-loadItem',function(ev,index,elem,success){
		var $imgs = $(elem).find('.floor-img');
		loadImages($imgs,success,function($img,url){
			$img.attr('src','images/floor/placeholder.png');
		});

	});
	//楼层html的具体加载
	$doc.on('floor-loadItem',function(ev,index,elem,success){
		var $elem = $(elem);
		//请求数据
		getDataOnce($doc,'data/floor/floorData.json',function(floorData){
			var html = buildFloorHtml(floorData[index]);
			//模拟网络延时
			setTimeout(function(){
				$elem.html(html);
				//加载图片
				lazyLoad({
					totalItemNum:$elem.find('.floor-img').length,
					$elem:$elem,
					eventName:'tab-show',
					eventPrefix:'tab'		
				});
				$elem.tab({
					css3:false,
					js:false,
					mode:'fade',
					eventName:'mouseenter',
					activeIndex:0,
					delay:200,
					interval:0
				});					
			},1000)
		});
		success();
	});
	//移除楼层特殊的事件
	$doc.on('floor-loadedItems',function(){
		$win.off('scroll resize',$floors.toShowFn);	
	})

	//楼层html的按需加载
	lazyLoad({
		totalItemNum:$floors.length,
		$elem:$doc,
		eventName:'floor-show',
		eventPrefix:'floor'	
	});

	$win.on('scroll resize load',$floors.toShowFn = function(){
		clearTimeout($floors.floorTimer);
		$floors.floorTimer = setTimeout(function(){
			timeToShow();
		},200)
	});

	/*楼层结束*/

	/*电梯开始*/

	//判断楼层号
	function whichFloor(){
		var num = -1;
		$floors.each(function(index,elem){
			num = index;
			if($win.scrollTop() + $win.height()/2 < $(elem).offset().top){
				num = index - 1;
				return false;
			}
		})
		return num;
	}
	//设置电梯
	var $elevator = $('#elevator');
	$elevator.items = $elevator.find('.elevator-item');
	function setElevator(){
		var num = whichFloor();
		if(num == -1){
			$elevator.fadeOut(); 
		}else{
			$elevator.fadeIn();
			$elevator.items.removeClass('elevator-active'); 
			$elevator.items.eq(num).addClass('elevator-active'); 
		}
	}
	//监听事件自动设置楼层
	$win.on('scroll resize load',function(){
		clearTimeout($elevator.elevatorTimer);
		$elevator.elevatorTimer = setTimeout(function(){
			setElevator();
		},200)
	});
	//监听电梯点击事件
	$elevator.on('click','.elevator-item',function(){
		var num = $elevator.items.index(this);
		$('body,html').animate({
			scrollTop:$floors.eq(num).offset().top
		})
	});

	/*电梯结束*/

})(jQuery);