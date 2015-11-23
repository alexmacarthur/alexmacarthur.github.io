var viewportHeight = $(window).height();

$(document).ready(function(){
	var splitHeight = viewportHeight/$('.HomeSection').length;

	$('.HomeSection').css('min-height',viewportHeight);

	(function(){
		var $homeHeader = $('.HomeSection--main .HomeSection-container');
		var newPadding = ($(window).height() - $homeHeader.innerHeight())/2;
		$homeHeader.css('padding-top',newPadding);
	})()

	$('.HomeHeader').typeIt({
		typeSpeed: 125,
	  	whatToType: ["Hi, I'm Alex MacArthur."]
	}, function(){
		$('.SocialNav-item').addClass('animation-popup');
	});

	$.scrollify({
	    section : ".HomeSection"
	});

	currentMenuLink();
	$(window).scroll(function() {
		currentMenuLink();
	});

	$('#ContactForm').submit(function(e){
		e.preventDefault();
		$.ajax({
		    url: "//formspree.io/alex@macarthur.me", 
		    method: "POST",
		    data: {message: "hello!"},
		    dataType: "json"
		}).done(function(response) {

            // Clear the form.
            $('input[name="name"]').val('');
            $('input[name="_replyto"]').val('');
            $('textarea[name="message"]').val('');

            $('.ContactForm-submit').prop('disabled', true);
            $('#StatusMessages').html('Your message was successfully sent! Thanks.').removeClass('failure').addClass('success');
        }).fail(function(data) {
        	$('#StatusMessages').html('Sorry, an something\'s messed up. Refresh the page to try again, or just send an email to alex@macarthur.me.').removeClass('success').addClass('failure');
        });
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
