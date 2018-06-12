/*
* @Author: TomChen
* @Date:   2018-06-12 18:20:04
* @Last Modified by:   TomChen
* @Last Modified time: 2018-06-12 19:59:54
*/

;(function($){
	function DropDown($elem,options){
		this.$elem = $elem;
		this.options = options;
		this.activeClass = this.$elem.data('active') + '-active';
		this.$layer = this.$elem.find('.dropdown-layer');
		
		this._init();
	
	}

	DropDown.prototype = {
		constructor:DropDown,
		_init:function(){
			//初始化显示隐藏模块
			this.$layer.showHide(this.options);	

			this.$layer.on('show shown hide hidden',function(ev){
				// console.log(ev.type);
				this.$elem.trigger('dropdown-'+ev.type);
			}.bind(this));

			//绑定事件
			//this.$elem.hover(this.show.bind(this),this.hide.bind(this));
			if(this.options.eventName == 'click'){
				this.$elem.on('click',function(ev){
					ev.stopPropagation();
					this.show();
				}.bind(this));
				$(document).on('click',$.proxy(this.hide,this));
			}else{
				this.$elem.hover($.proxy(this.show,this),$.proxy(this.hide,this));	
			}
		},
		show:function(){
			//避免用户快速划过触发事件
			if(this.options.delay){
				this.timer = setTimeout(function(){
					//显示下拉层
					this.$layer.showHide('show');
					this.$elem.addClass(this.activeClass);		
				}.bind(this),this.options.delay)
			}else{
				//显示下拉层
				this.$layer.showHide('show');
				this.$elem.addClass(this.activeClass);					
			}	
		},
		hide:function(){
			if(this.options.delay){
				clearTimeout(this.timer);
			}
			//隐藏下拉层
			this.$layer.showHide('hide');
			this.$elem.removeClass(this.activeClass);	
		}
	};

	DropDown.DEFAULTS = {
		css3:false,
		js:true,
		mode:'slideUpDown',
		delay:200,
		eventName:'hover'		
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