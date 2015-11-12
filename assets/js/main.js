var viewportHeight = $(window).height();

$(document).ready(function(){
	var splitHeight = viewportHeight/$('.HomeSection').length;

	$('.HomeSection').css('height',viewportHeight);

	$('.HomeHeader').typeIt({
		typeSpeed: 125,
	  	whatToType: ["test"]
	});

	$.scrollify({
	    section : ".HomeSection"
	});

	currentMenuLink();
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
	var mostVisibleID = 'top';

	// grabs each section and checks for most percentage on screen
	$.each(sections, function() {
		mostVisible = $(this).fracs().visible > mostVisible.fracs().visible ? $(this) : mostVisible;
		mostVisibleID = mostVisible.attr('id');
	});

	if(mostVisibleID === 'top') {
		$('.SectionsNav--corner').addClass('is-invisible');
		$('.SocialNav--corner').addClass('is-invisible');
	} else {
		$('.SectionsNav--corner').removeClass('is-invisible');
		$('.SocialNav--corner').removeClass('is-invisible');
	}

	$('.SectionsNav-link').removeClass('active-link');
	$('.SectionsNav-link[href="#' + mostVisibleID + '"]').addClass('active-link');

}
