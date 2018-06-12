/*
* @Author: TomChen
* @Date:   2018-06-12 18:20:04
* @Last Modified by:   TomChen
* @Last Modified time: 2018-06-12 19:02:33
*/

;(function($){
	function DropDown($elem,options){
		this.$elem = $elem;
		this.options = options;
		this.activeClass = this.$elem.data('active') + '-active';
		this.$layer = this.$elem.find('.dropdown-layer');
		
		//初始化显示隐藏模块
		this.$layer.showHide(this.options);	

		//绑定事件
		//this.$elem.hover(this.show.bind(this),this.hide.bind(this));	
		this.$elem.hover($.proxy(this.show,this),$.proxy(this.hide,this));
	}

	DropDown.prototype = {
		constructor:DropDown,
		show:function(){
			//显示下拉层
			this.$layer.showHide('show');
			this.$elem.addClass(this.activeClass);			
		},
		hide:function(){
			//隐藏下拉层
			this.$layer.showHide('hide');
			this.$elem.removeClass(this.activeClass);	
		}
	};

	DropDown.DEFAULTS = {
		css3:false,
		js:true,
		mode:'slideUpDown'		
	}

	$.fn.extend({
		dropdown:function(options){
			return this.each(function(){
				/*
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
				*/
				options  = $.extend(DropDown.DEFAULTS,options);
				new DropDown($(this),options)
			});
		}
	})
})(jQuery);