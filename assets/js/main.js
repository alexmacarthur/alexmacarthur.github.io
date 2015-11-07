$(document).ready(function(){
	$('.HomeSection').css('height',$(window).height());

	$('.HomeHeader').typeIt({
		typeSpeed: 125,
	  	whatToType: ["Hi, I'm Alex MacArthur."]
	});

	$.scrollify({
	    section : ".HomeSection"
	});

	$(window).scroll(function() {
		$('.SectionsNav-link').css('font-weight','');
	})

});

function scrollTo(section){
	$.scrollify.move("#"+section);
}
