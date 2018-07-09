/*
* @Author: TomChen
* @Date:   2018-06-08 20:17:35
* @Last Modified by:   TomChen
* @Last Modified time: 2018-07-09 15:32:38
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

	//轮播图按需加载函数
	function carouselImgLazyLoad($elem){

		var item = {},
		    totalItemNum =  $elem.find('.carousel-img').length,
			loadedItemNum = 0,
			loadFn = null;
		
		$elem.on('carousel-show',loadFn = function(ev,index,elem){
			console.log('carousel-show loading...');
			if(item[index] != 'loaded'){
				$elem.trigger('carousel-loadItem',[index,elem])
			}
		});

		$elem.on('carousel-loadItem',function(ev,index,elem){
			console.log(index,'loading...');
			var $imgs = $(elem).find('.carousel-img');
			$imgs.each(function(){
				var $img = $(this);
				var imgUrl = $img.data('src');
				loadImage(imgUrl,function(url){
					$img.attr('src',url);
				},function(url){
					$img.attr('src','images/focus-carousel/placeholder.png');
				});
				item[index] = 'loaded';
				loadedItemNum++;
				if(loadedItemNum == totalItemNum){
					$elem.trigger('carousel-loadedItems')
				}
			})
		});

		$elem.on('carousel-loadedItems',function(){
			$elem.off('carousel-show',loadFn)
		});
	}

	/*中心轮播图开始*/
	var $focusCarousel = $('.focus .carousel-container');

	carouselImgLazyLoad($focusCarousel);

	$focusCarousel.on('carousel-loadedItems',function(){
		$focusCarousel.off('carousel-show',$focusCarousel.loadFn)
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

	carouselImgLazyLoad($todaysCarousel);

	$todaysCarousel.carousel({
		activeIndex:0,
		mode:'slide',
	});
	/*今日商品结束*/

	/*楼层开始*/
	var $floors = $('.floor');

	/*
	$floors.on('tab-show tab-shown tab-hide tab-hidden',function(ev,index,elem){
		console.log(index,elem,ev.type);
	});
	*/
	//楼层图片图按需加载函数
	
	function floorImgLazyLoad($elem){

		var item = {},
		    totalItemNum =  $elem.find('.floor-img').length,
			loadedItemNum = 0,
			loadFn = null;
		
		$elem.on('tab-show',loadFn = function(ev,index,elem){
			console.log('tab-show loading...');
			if(item[index] != 'loaded'){
				$elem.trigger('tab-loadItem',[index,elem])
			}
		});

		$elem.on('tab-loadItem',function(ev,index,elem){
			console.log(index,'loading...');
			var $imgs = $(elem).find('.floor-img');
			$imgs.each(function(){
				var $img = $(this);
				var imgUrl = $img.data('src');
				loadImage(imgUrl,function(url){
					setTimeout(function(){
						$img.attr('src',url);
					},1000)
					
				},function(url){
					$img.attr('src','images/floor/placeholder.png');
				});
				item[index] = 'loaded';
				loadedItemNum++;
				if(loadedItemNum == totalItemNum){
					$elem.trigger('tab-loadedItems')
				}
			})
		});

		$elem.on('tab-loadedItems',function(){
			$elem.off('tab-show',loadFn)
		});
	}
	/*

	$floors.each(function(){
		floorImgLazyLoad($(this));
	});

	//楼层选项卡
	$floors.tab({
		css3:false,
		js:false,
		mode:'fade',
		eventName:'mouseenter',
		activeIndex:0,
		delay:200,
		interval:0
	});
	*/
	var $win = $(window);
	var $doc = $(document);
	function isVisible($elem){
		return ($win.height() + $win.scrollTop() > $elem.offset().top) && ($win.scrollTop() < $elem.offset().top+$elem.height())
	}

	function timeToShow(){
		console.log('time to show...');
		$floors.each(function(index){
			if(isVisible($(this))){
				// console.log(index+" is show");
				$doc.trigger('floor-show',[index,this])
			}
		})		
	}

	/*
	$doc.on('floor-show',function(ev,index,elem){
		//... HTML
		console.log(index,elem);
	})
	*/
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
	
	function floorHtmlLazyLoad(){

		var item = {},
		    totalItemNum =  $floors.length,
			loadedItemNum = 0,
			loadFn = null;
		
		$doc.on('floor-show',loadFn = function(ev,index,elem){
			console.log('floor-show loading...');
			if(item[index] != 'loaded'){
				$doc.trigger('floor-loadItem',[index,elem])
			}
		});

		$doc.on('floor-loadItem',function(ev,index,elem){
			//HTML 加载

			console.log('will load '+index,elem);
			//请求数据
			getDataOnce($doc,'data/floor/floorData.json',function(floorData){
				var html = buildFloorHtml(floorData[index]);
				//模拟网络延时
				setTimeout(function(){
					$(elem).html(html);
					//加载图片
					floorImgLazyLoad($(elem));
					$(elem).tab({
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
			
			item[index] = 'loaded';
				loadedItemNum++;
				if(loadedItemNum == totalItemNum){
					$doc.trigger('floor-loadedItems')
				}			
			});

		$doc.on('floor-loadedItems',function(){
			$doc.off('floor-show',loadFn)
			$win.off('scroll resize',$floors.toShowFn);
		});
	}

	$win.on('scroll resize',$floors.toShowFn = function(){
		clearTimeout($floors.floorTimer);
		$floors.floorTimer = setTimeout(function(){
			timeToShow();
		},200)
	});

	floorHtmlLazyLoad();

	/*楼层结束*/
})(jQuery);