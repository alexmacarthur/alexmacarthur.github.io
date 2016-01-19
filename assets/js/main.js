// cached variables
var $window = $(window);
var $top = $('#top');
var $main = $('#main');
var $homeSections = $('.HomeSection', $main);
var $menuToggle = $('#menuToggle');
var $menuItemsWrapper = $('#menuItemsWrapper');
var $bottomNav = $('#bottomNav', $main);
var $mostVisible = $('#top', $main);
var $sectionNavLinks = $('.SectionsNav-link', $main);
var mostVisibleID = 'top';
var viewportHeight = $window.height();
var viewportWidth = $window.width();

$(document).ready(function(){

	$('#body').removeClass('no-js');

	// on resize, do stuff
	$window.resize(function(){
		viewportHeight = $window.height();
		viewportWidth = $window.width();
		initScrollify();
	});

	initTypeIt();

	initCurrentMenuLink();

	initSlick();

	initScrollify();

	initContactForm();

	initSmoothScroll();

	initMobileMenu();

});

function initMobileMenu() {
	$bottomNav.on('click', $menuToggle, function(){
		$menuItemsWrapper.toggleClass('is-open');
	})
}

function initSmoothScroll() {
	$main.on('click', '.SectionsNav-link, #justAsk', function(e) {
		e.preventDefault();
		var theID = $(this).attr('href');

		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				$('html,body').animate({
				  scrollTop: target.offset().top
				}, 1000, function() {
					window.location.hash = theID;
				});
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
		$('.SocialNav-item', $main).addClass('animation-popup');
	});
}

function initScrollify() {
	if(viewportWidth > 600 && viewportHeight > 500) {
		if(!$main.hasClass('scrollify-enabled')) {
			$.scrollify({
				section : ".HomeSection",
				sectionName: ""
			});
			$main.addClass('scrollify-enabled');
		}
	} else {
		if($main.hasClass('scrollify-enabled')) {
			$.scrollify.destroy();
			$main.removeClass('scrollify-enabled');
		}
		
		$homeSections.css('height', 'auto');
		
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

	$.each($homeSections, function() {
		$mostVisible = $(this).fracs().visible > $mostVisible.fracs().visible ? $(this) : $mostVisible;
		mostVisibleID = $mostVisible.attr('id');
	});
	
	if(mostVisibleID === 'top') {
		$bottomNav.addClass('is-invisible');
	} else {
		$bottomNav.removeClass('is-invisible');
	}
	
	$sectionNavLinks.removeClass('active-link');
	$main.find('.SectionsNav-link[href="#' + mostVisibleID + '"]').addClass('active-link');

}
