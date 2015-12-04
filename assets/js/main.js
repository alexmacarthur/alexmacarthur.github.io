var viewportHeight = $(window).height();
var heightIssue = false;

$(document).ready(function(){

	$('#top').css('height', viewportHeight);

	// check if any of the HomeSections are taller than the viewport
	checkForHeightIssue();

	// initilize snap scrolling
	if(heightIssue !== true){
		initScrollify();
	}

	$(window).resize(function(){
		//$('#main').removeClass('has-height-issue');

		// check if any of the HomeSections are taller than the viewport
		checkForHeightIssue();

		// initilize snap scrolling
		if(heightIssue !== true){
			initScrollify();
		}
	});

	// initialize TypeIt
	initTypeIt();

	// set the color of the appropriate menu item, based on where we are on the page
	initCurrentMenuLink();

	// initialize the portfolio slider
	initSlick();

	// set up contact form functionality
	initContactForm();

});

function checkForHeightIssue() {
	var $homeSections = $('.HomeSection--notTop');
	$homeSections.each(function(){
		var thisHeight = $(this).find('.HomeSection-wrapper').height();
		if(thisHeight >= viewportHeight){
			heightIssue = true;
			$('#main').addClass('has-height-issue');
		}
	});
}

function initTypeIt() {
	$('.HomeHeader').typeIt({
		typeSpeed: 125,
			whatToType: ["Hi, I'm Alex MacArthur."]
	}, function(){
		$('.SocialNav-item').addClass('animation-popup');
	});
}

function initScrollify() {
	$.scrollify({
			section : ".HomeSection"
	});
}

function initCurrentMenuLink() {
	currentMenuLink();
	$(window).scroll(function() {
		currentMenuLink();
	});
}

function initSlick() {
	$('.WorkList').slick({
		infinite: false,
		slidesToShow: 3,
		slidesToScroll: 3,
		prevArrow: $('#slickPrevious'),
		nextArrow: $('#slickNext'),
		speed: 100,
		easing: 'swing',
		responsive: [
		{
			breakpoint: 992,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 2,
			}
		},
		{
			breakpoint: 600,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			}
		},
	]
	});
}

function initContactForm() {
	$('#ContactForm').submit(function(e){
		e.preventDefault();
		var $formName = $('#formName');
		var $formEmail = $('#formEmail');
		var $formMessage = $('#formMessage');
		var $statusMessages = $('#StatusMessages');

		$statusMessages.removeClass('failure success');

		$.ajax({
				url: "//formspree.io/alex@macarthur.me",
				method: "POST",
				data: {
					name: $formName.val(),
					email: $formEmail.val(),
					message: $formMessage.val(),
				},
				dataType: "json"
		}).done(function(response) {
			$formName.val('');
			$formEmail.val('');
			$formMessage.val('');

			$statusMessages.html('Your message was successfully sent! Thanks.').removeClass('failure').addClass('success');
		}).fail(function(data) {
			$statusMessages.html('Sorry, an something\'s messed up. Refresh the page to try again, or just send an email to alex@macarthur.me.').removeClass('success').addClass('failure');
		});
	});
}

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
