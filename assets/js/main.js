var viewportHeight = $(window).height();

$(document).ready(function(){
	var splitHeight = viewportHeight/$('.HomeSection').length;

	$('.HomeSection').css('height',viewportHeight);

	$('.HomeHeader').typeIt({
		typeSpeed: 125,
	  	whatToType: ["Hi, I'm Alex MacArthur."]
	});

	$.scrollify({
	    section : ".HomeSection"
	});

	$(window).scroll(function() {
		$('.SectionsNav-link').css('font-weight','');
	});

	screenSwitch();
});

function scrollTo(section){
	$.scrollify.move("#"+section);
}

function screenSwitch(){

	var sections = $('.HomeSection');

	$.each(sections, function( index, value ) {
		  console.log('hi');
		});

	var fracs = $('.HomeSection').fracs();
	console.log(fracs);



}