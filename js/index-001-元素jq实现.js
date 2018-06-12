/*
* @Author: TomChen
* @Date:   2018-06-08 20:17:35
* @Last Modified by:   TomChen
* @Last Modified time: 2018-06-12 18:22:06
*/
$(function(){
	$('.dropdown').hover(function(){
		//添加active class
		var $this = $(this);
		// console.log($this.data('active'));
		var activeClass = $this.data('active') + '-active';
		$this.addClass(activeClass);
	},function(){
		//删除active class
		var $this = $(this);
		var activeClass = $this.data('active') + '-active';
		$this.removeClass(activeClass);		
	});
});