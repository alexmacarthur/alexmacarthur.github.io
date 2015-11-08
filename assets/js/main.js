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
		currentMenuLink();
	});

});

function scrollTo(section){
	$.scrollify.move("#"+section);
}

function currentMenuLink(){

	var sections = $('.HomeSection');
	var mostVisible = $('#top');
	var mostVisibleID = mostVisible.attr('id');

	// grabs each section and checks for most percentage on screen
	$.each(sections, function() {
		mostVisible = $(this).fracs().visible > mostVisible.fracs().visible ? $(this) : mostVisible;
		mostVisibleID = mostVisible.attr('id');
	});

	$('.SectionsNav-link').removeClass('active-link');
	$('.SectionsNav-link[href="#' + mostVisibleID + '"]').addClass('active-link');

}