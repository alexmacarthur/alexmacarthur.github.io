var $window = $(window);
var $top = $('#top');
var viewportHeight = $window.height();
var windowWidth = $window.width();
var heightIssue = false;

$(document).ready(function(){

	$(".main").onepage_scroll({
	   sectionContainer: "section",     // sectionContainer accepts any kind of selector in case you don't want to use section
	   easing: "ease-in",                  // Easing options accepts the CSS3 easing animation such "ease", "linear", "ease-in",                             // "ease-out", "ease-in-out", or even cubic bezier value such as "cubic-bezier(0.175, 0.885, 0.420, 1.310)"
	   animationTime: 1000,             // AnimationTime let you define how long each section takes to animate
	   pagination: false,                // You can either show or hide the pagination. Toggle true for show, false for hide.
	   updateURL: false,                // Toggle this true if you want the URL to be updated automatically when the user scroll to each page.
	   beforeMove: function(index) {},  // This option accepts a callback function. The function will be called before the page moves.
	   afterMove: function(index) {},   // This option accepts a callback function. The function will be called after the page moves.
	   loop: false,                     // You can have the page loop back to the top/bottom when the user navigates at up/down on the first/last page.
	   keyboard: true,                  // You can activate the keyboard controls
	   responsiveFallback: 600,        // You can fallback to normal page scroll by defining the width of the browser in which
	                                    // you want the responsive fallback to be triggered. For example, set this to 600 and whenever
	                                    // the browser's width is less than 600, the fallback will kick in.
	   direction: "vertical"            // You can now define the direction of the One Page Scroll animation. Options available are "vertical" and "horizontal". The default value is "vertical".  
	});

	// check if any of the HomeSections are taller than the viewport
	// checkForHeightIssue();

	// initilize snap scrolling
	if(heightIssue !== true){
		//initScrollify();
	}
	// set top section to screen height
	$top.css('height', viewportHeight);

	$window.resize(function(){
		// reset viewportHeight & viewportWidth
		viewportHeight = $window.height();
		viewportWidth = $window.width();
		// set top section to screen height
		$top.css('height', viewportHeight);
		// check if any of the HomeSections are taller than the viewport
		//checkForHeightIssue();
		// initilize snap scrolling
		if(heightIssue !== true){
			//initScrollify();
		}
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

// function initScrollify() {
// 	$.scrollify({
// 			section : ".HomeSection"
// 	});
// }

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
		$('.SectionsNav--corner').addClass('is-invisible');
		$('.SocialNav--corner').addClass('is-invisible');
	} else {
		$('.SectionsNav--corner').removeClass('is-invisible');
		$('.SocialNav--corner').removeClass('is-invisible');
	}

	$('.SectionsNav-link').removeClass('active-link');
	$('.SectionsNav-link[href="#' + mostVisibleID + '"]').addClass('active-link');

}
