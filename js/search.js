/*
* @Author: TomChen
* @Date:   2018-06-13 18:30:03
* @Last Modified by:   TomChen
* @Last Modified time: 2018-06-13 18:36:09
*/
;(function($){
	var $searchFrom = $('#search-form'),
		$searchInput = $('.search-input');

	//提交表单的验证
	$searchFrom.on('submit',function(){
		if(getInputVal() == ''){
			return false;
		}
		console.log('submit...');
	});



	function getInputVal(){
		return $.trim($searchInput.val());
	}

})(jQuery);