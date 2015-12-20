var $window = $(window);
var $top = $('#top');
var viewportHeight = $window.height();
var windowWidth = $window.width();
var heightIssue = false;
var $homeSections = $('.HomeSection');

$(document).ready(function(){

	// on resize, do stuff
	$window.resize(function(){
		viewportHeight = $window.height();
		viewportWidth = $window.width();
	});

	if( windowWidth <= 600){
		initSmoothScroll();
	}

	// initialize TypeIt
	initTypeIt();

	// set the color of the appropriate menu item, based on where we are on the page
	initCurrentMenuLink();

	// initialize the portfolio slider
	initSlick();

	// init scrollify (MUST BE INITIALIZED AFTER initSlick())
	initScrollify();

	// set up contact form functionality
	initContactForm();

});

function initSmoothScroll() {
	$('.SectionsNav-link').click(function(e) {
		e.preventDefault();
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				$('html,body').animate({
				  scrollTop: target.offset().top
				}, 1000);
				return false;
			}
		}
	});
}

function checkForHeightIssue() {
	var $homeSections = $('.HomeSection--notTop');
	$homeSections.each(function(){
		var thisHeight = $(this).find('.HomeSection-wrapper').height();

		console.log('Section: ' + thisHeight);
		console.log('VP: ' + viewportHeight);

		if(thisHeight >= viewportHeight){
			console.log($(this).find('.HomeSection-wrapper'));
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
			section : ".HomeSection",
			sectionName: ""
	});
}

function initCurrentMenuLink() {
	currentMenuLink();
	$window.scroll(function() {
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
	//$.scrollify.move("#"+section);
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
		$('.BottomNav').addClass('is-invisible');
	} else {
		$('.BottomNav').removeClass('is-invisible');
	}

	$('.SectionsNav-link').removeClass('active-link');
	$('.SectionsNav-link[href="#' + mostVisibleID + '"]').addClass('active-link');

}
