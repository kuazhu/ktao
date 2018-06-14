/*
* @Author: TomChen
* @Date:   2018-06-08 20:17:35
* @Last Modified by:   TomChen
* @Last Modified time: 2018-06-14 19:21:55
*/
;(function($){
	//$('.dropdown').dropdown();
	
	var $dropdown = $('.dropdown');
	

	$dropdown.on('dropdown-show',function(ev){
		// console.log(this);
		var $this = $(this);
		//当需要显示时从服务器获取数据并且加载

		//获取需要请求的地址
		var loadUrl = $this.data('load');
		//如果页面上没有设置请求地址直接返回
		if(!loadUrl) return;

		var isLoaded = $this.data('isLoaded');
		//如果已经加载过数据了直接返回
		if(isLoaded) return;
		
		//如果有请求地址,发送请求获取数据
		$.getJSON(loadUrl,function(data){
			console.log(data);
			var html = '';
			for(var i = 0;i<data.length;i++){
				html += '<li><a href="'+data[i].url+'" class="menu-item">'+data[i].name+'</a></li>';
			}
			//模拟网络延时
			setTimeout(function(){
				$this.find('.dropdown-layer').html(html);
				$this.data('isLoaded',true);
			},1000);
		});

	});
	
	$dropdown.dropdown({
		css3:false,
		js:true,
		mode:'slideUpDown'
	});
	/*测试暴露接口
	$('button').eq(0).click(function(){
		$dropdown.dropdown('show');
	})
	$('button').eq(1).click(function(){
		$dropdown.dropdown('hide');
	})	
	*/

	/*搜索框*/
	$('.search').search({
		autocomplete:true
	});
	$('.search')
	.on('getData',function(ev,data,$searchLayer){
		console.log('get data');
				// console.log(data);
			if(data.result.length == 0){
				$searchLayer.html('').hide();
				return;
			}
			var html = '';

			var dataNum = 10;

			for(var i = 0;i<data.result.length;i++){
				if(i>=dataNum) break;
				html += '<li class="search-item">'+data.result[i][0]+'</li>'
			}

			$searchLayer.html(html).showHide('show');		
	})
	.on('getNoData',function(ev,$searchLayer){
		$searchLayer.html('').showHide('hide');
	})

})(jQuery);