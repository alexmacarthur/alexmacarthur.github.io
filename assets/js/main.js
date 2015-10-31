$('.HomeHeader').typeIt({
	typeSpeed: 150,
  	whatToType: "Alex MacArthur"
});

(function(){
	var newMargin = ($(window).height() - $('.HomeHeader').height()) / 3;
	$('.HomeHeader').css('margin-top', newMargin);
})();
