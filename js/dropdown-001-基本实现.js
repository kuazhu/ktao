/*
* @Author: TomChen
* @Date:   2018-06-12 18:20:04
* @Last Modified by:   TomChen
* @Last Modified time: 2018-06-12 18:43:59
*/

;(function($){
	$.fn.extend({
		dropdown:function(){
			return this.each(function(){
				var $this = $(this);
				var activeClass = $this.data('active') + '-active';
				var $layer = $this.find('.dropdown-layer');
				//初始化显示隐藏模块
				$layer.showHide({
					css3:true,
					js:true,
					mode:'slideUpDown'
				});
				$this.hover(function(){
					//显示下拉层
					$layer.showHide('show');
					$this.addClass(activeClass);
				},function(){
					//隐藏下拉层
					$layer.showHide('hide');
					$this.removeClass(activeClass);	
				});
			});
		}
	})
})(jQuery);