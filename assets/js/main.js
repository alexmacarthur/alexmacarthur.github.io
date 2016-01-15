
// cached variables
var $window = $(window);
var $top = $('#top');
var $main = $('#main');
var $homeSections = $('.HomeSection', $main);
var $menuToggle = $('#menuToggle');
var $menuItemsWrapper = $('#menuItemsWrapper');
var $bottomNav = $('#bottomNav', $main);
var $mostVisible = $('#top');
var $sectionNavLinks = $('.SectionsNav-link');
var mostVisibleID = 'top';
var viewportHeight = $window.height();
var viewportWidth = $window.width();

$(document).ready(function(){

	// on resize, do stuff
	$window.resize(function(){
		viewportHeight = $window.height();
		viewportWidth = $window.width();
		initScrollify();
	});

	// initialize TypeIt
	initTypeIt();

	// set the color of the appropriate menu item, based on where we are on the page
	initCurrentMenuLink();

	// initialize the portfolio slider
	initSlick();

	// initlize the scroll-snapping plugin
	initScrollify();

	// set up contact form functionality
	initContactForm();

	// set up smooth scrolling
	initSmoothScroll();

	// init mobile menu
	initMobileMenu();

});

function initMobileMenu() {
	$menuToggle.on('click', function() {
		$menuItemsWrapper.toggleClass('is-open');
	});
}

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

function initTypeIt() {
	$('#homeHeader').typeIt({
		typeSpeed: 125,
			whatToType: ["Hi, I'm Alex MacArthur."]
	}, function(){
		$('.SocialNav-item', '.SocialNav').addClass('animation-popup');
	});
}

function initScrollify() {
	// if using desktop/tablet, init scrollify if not already initialized
	if(viewportWidth > 600) {
		if(!$main.hasClass('scrollify-enabled')) {
			$.scrollify({
				section : ".HomeSection",
				sectionName: ""
			});
			$main.addClass('scrollify-enabled');
		}
	// if not already destroyed, destroy it
	} else {
		if($main.hasClass('scrollify-enabled')) {
			$.scrollify.destroy();
			$main.removeClass('scrollify-enabled');
		}
		// set each HomeSection to auto height
		$homeSections.css('height', 'auto');
		// set top HomeSection to explicit height
		$top.css('height', viewportHeight);
	}
}

function initCurrentMenuLink() {
	currentMenuLink();
	$window.scroll(function() {
		currentMenuLink();
	});
}

function initSlick() {
	$('#workList').slick({
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

function currentMenuLink(){

	// grabs each section and checks for most percentage on screen
	$.each(homeSections, function() {
		$mostVisible = $(this).fracs().visible > $mostVisible.fracs().visible ? $(this) : $mostVisible;
		mostVisibleID = $mostVisible.attr('id');
	});
	
	if(mostVisibleID === 'top') {
		$bottomNav.addClass('is-invisible');
	} else {
		$bottomNav.removeClass('is-invisible');
	}
	
	$sectionNavLinks.removeClass('active-link');
	$('.SectionsNav-link[href="#' + mostVisibleID + '"]').addClass('active-link');

}
