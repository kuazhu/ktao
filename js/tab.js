/*
* @Author: TomChen
* @Date:   2018-07-05 10:36:38
* @Last Modified by:   TomChen
* @Last Modified time: 2018-07-09 09:25:41
*/
;(function($){

	function Tab($elem,options){
		this.$elem = $elem;
		this.options = options;
		this.$tabItems = this.$elem.find('.tab-item');
		this.itemNum = this.$tabItems.length;
		this.$tabPanels = $elem.find('.tab-panel');

		this.now = this._getCorrectIndex(options.activeIndex);
		this._init();
	}
	Tab.prototype = {
		constructor:Tab,
		_init:function(){
			var self = this;
			var timer = null;
			//初始化页面
			this.$tabItems.eq(this.now).addClass('tab-item-active');
			this.$tabPanels.eq(this.now).show();

			this.$tabPanels.on('show shown hide hidden',function(ev){
				self.$elem.trigger('tab-'+ev.type,[self.$tabPanels.index(this),this]);
			});
			//触发事件
			self.$elem.trigger('tab-show',[this.now,this.$tabPanels[this.now]]);

			//绑定事件
			var eventName = this.options.eventName == 'click' ? 'click' : 'mouseenter';

			//初始化showHide
			this.$tabPanels.showHide(this.options);

			this.$elem.on(eventName,'.tab-item',function(){
				var index = self.$tabItems.index(this);

				if(self.options.delay){
					clearTimeout(timer);
					timer = setTimeout(function(){
						self.toggle(index);
					},self.options.delay)
				}else{
					self.toggle(index);
				}
			});

			if(this.options.interval){
				this.auto();
				this.$elem.hover($.proxy(self.pause,self),$.proxy(self.auto,self));		
			}			
		},
		toggle:function(index){
			if(this.now == index) return;
			//隐藏当前的
			this.$tabItems.eq(this.now).removeClass('tab-item-active');
			this.$tabPanels.eq(this.now).showHide('hide');
			//显示index对应的
			this.$tabItems.eq(index).addClass('tab-item-active');
			this.$tabPanels.eq(index).showHide('show');	

			this.now = index;		
		},
		auto(){
			var self = this;
			this.autoTimer = null;
			this.autoTimer = setInterval(function(){
				self.toggle(self._getCorrectIndex(self.now+1));
			},this.options.interval)
		},
		pause(){
			clearInterval(this.autoTimer);
		},		
		_getCorrectIndex(index){
			if(index >= this.itemNum) return 0;
			if(index < 0) return (this.itemNum - 1);
			return index;
		}
	}

	Tab.DEFAULTS = {
		css3:false,
		js:false,
		mode:'fade',
		eventName:'mouseenter',
		activeIndex:0,
		delay:200,
		interval:2000
	}

	$.fn.extend({
		tab:function(options){
			return this.each(function(){
				var $this = $(this);
				var tab = $this.data('tab');
				if(!tab){//单例模式
					options  = $.extend({},Tab.DEFAULTS,options);
					tab = new Tab($(this),options);
					$this.data('tab',tab);
				}
				if(typeof tab[options] == 'function'){
					tab[options]();
				}
			});
		}
	})

})(jQuery);