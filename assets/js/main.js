$('.HomeHeader').typeIt({
	typeSpeed: 125,
  	whatToType: ["Hi, I'm Alex.", "Sup."]
});

(function(){
	var newMargin = ($(window).height() - $('.HomeHeader').height()) / 3;
	$('.HomeHeader').css('margin-top', newMargin);
})();
