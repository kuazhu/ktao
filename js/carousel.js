/*
* @Author: TomChen
* @Date:   2018-07-05 10:36:38
* @Last Modified by:   TomChen
* @Last Modified time: 2018-07-05 14:38:57
*/
;(function($){

	function Carousel($elem,options){
		this.$elem = $elem;
		this.options = options;
		this.$carouselItems = this.$elem.find('.carousel-item');
		this.itemNum = this.$carouselItems.length;
		this.$btns = $elem.find('.btn-item');
		this.$controlBtns = $elem.find('.control');

		this.now = this._getCorrectIndex(options.activeIndex);
		this._init();
	}
	Carousel.prototype = {
		constructor:Carousel,
		_init:function(){
			var self = this;
			//显示当前的
			this.$carouselItems.eq(this.now).show();
			//激活底部对应的按钮
			this.$btns.eq(this.now).addClass('active');

			//划入划出
			if(this.options.mode === 'slide'){
				this.tab = this._slide;
			//淡入淡出	
			}else{
				//初始化显示隐藏插件
				this.$carouselItems.showHide(this.options);
				this.tab = this._fade;
			}
			//绑定事件
			this.$elem
			.hover(function(){
				self.$controlBtns.show();
			},function(){
				self.$controlBtns.hide();
			})
			.on('click','.control-right',function(){

				self.tab(self._getCorrectIndex(self.now+1));
			})
			.on('click','.control-left',function(){
				self.tab(self._getCorrectIndex(self.now-1));
			});

			this.$btns.on('click',function(){
				self.tab(self.$btns.index($(this)));
			});

			if(this.options.interval){
				this.auto();
				this.$elem.hover($.proxy(self.pause,self),$.proxy(self.auto,self));		
			}				
		},
		//index表示将要显示的索引
		_fade(index){
			if(this.now == index) return;
			//当前的隐藏
			this.$carouselItems.eq(this.now).showHide('hide');
			this.$btns.eq(this.now).removeClass('active');
			//下一张显示
			this.$carouselItems.eq(index).showHide('show');
			this.$btns.eq(index).addClass('active');

			this.now = index;
		},
		_slide(){

		},
		auto(){
			var self = this;
			this.timer = null;
			this.timer = setInterval(function(){
				self.tab(self._getCorrectIndex(self.now+1));
			},this.options.interval)
		},
		pause(){
			clearInterval(this.timer);
		},
		_getCorrectIndex(index){
			if(index >= this.itemNum) return 0;
			if(index < 0) return (this.itemNum - 1);
			return index;
		}
	}

	Carousel.DEFAULTS = {
		css3:true,
		js:false,
		mode:'fade',
		activeIndex:1,
		interval:0
	}

	$.fn.extend({
		carousel:function(options){
			return this.each(function(){
				var $this = $(this);
				var carousel = $this.data('carousel');
				if(!carousel){//单例模式
					options  = $.extend(Carousel.DEFAULTS,options);
					carousel = new Carousel($(this),options);
					$this.data('carousel',carousel);
				}
				if(typeof carousel[options] == 'function'){
					carousel[options]();
				}
			});
		}
	})

})(jQuery);