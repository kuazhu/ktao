/*
* @Author: TomChen
* @Date:   2018-06-08 20:17:35
* @Last Modified by:   TomChen
* @Last Modified time: 2018-06-12 19:32:33
*/
;(function($){
	//$('.dropdown').dropdown();
	
	var $dropdown = $('.dropdown');
	$dropdown.on('dropdown-show dropdown-shown dropdown-hide dropdown-hidden',function(ev){
		console.log(ev.type);
	});
	$dropdown.dropdown({
		css3:false,
		js:true,
		mode:'slideUpDown'
	});

})(jQuery);