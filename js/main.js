$(document).ready(function(){
	// Select all links with hashes
	$('a[href*="#"]')
	  // Remove links that don't actually link to anything
		.not('[href="#"]')
		.not('[href="#0"]')
		.click(function(event) {
			// On-page links
			if (
				location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
				&& 
				location.hostname == this.hostname
			) {
				// Figure out element to scroll to
				var target = $(this.hash);
				target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
				// Does a scroll target exist?
				if (target.length) {
					// Only prevent default if animation is actually gonna happen
					event.preventDefault();
					$('html, body').animate({
						scrollTop: target.offset().top
					}, 1000, function() {
						// Callback after animation
						// Must change focus!
						var $target = $(target);
						$target.focus();
						if ($target.is(":focus")) { // Checking if the target was focused
							return false;
						} else {
							$target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
							$target.focus(); // Set focus again
						};
					});
				}
			}
		});


	$("#interactiveHeader, #aboutMeSection, #profileSection, #projectsSection, #highlightsSection, #contactSection").on("focus", function(){
		$(this).blur();
	});




	var navbarTriggeredYet = 0;

	var navbarWaypoint = new Waypoint({
		element: document.getElementById("aboutMeSection"),
		handler: function(direction) {
			if(direction === "down" && navbarTriggeredYet === 0) {
				$("#navigationBarSection").show("slide", { direction: "down" }, 500);
				navbarTriggeredYet = 1;
			}
		},
		offset: "95%"
	});




	$("#threeIdeologies div").on("mouseenter", function(){
		$(this).find("h2").stop().hide(500);
		$(this).find("p").stop().show(500);
		$(this).find("i").css("fontSize", "5rem");
	});


	$("#threeIdeologies div").on("mouseleave", function(){
		$(this).find("h2").stop().show(500);
		$(this).find("p").stop().hide(500);
		$(this).find("i").css("fontSize", "8rem");
	});




	setCarouselHeight('#testimonialCarousel');




	$("#projectsDisplayRow figure").on("mouseenter", function() {
		$(this).find("p").stop().fadeTo(500, 1);
		$(this).find("img").stop().css({
			"opacity": "1",
			"-webkit-transform": "scale(1.05)",
			"-ms-transform": "scale(1.05)",
			"transform": "scale(1.05)"
		});
	});


	$("#projectsDisplayRow figure").on("mouseleave", function() {
		$(this).find("p").stop().fadeTo(500, 0.5);
		$(this).find("img").stop().css({
			"opacity": "0.5",
			"-webkit-transform": "scale(1.05)",
			"-ms-transform": "scale(1.05)",
			"transform": "scale(1)"
		});
	});




	var highlight1TriggeredYet = 0;
	var highlight2TriggeredYet = 0;
	var highlight3TriggeredYet = 0;
	var highlight4TriggeredYet = 0;

	var highlight1Waypoint = new Waypoint({
		element: document.getElementById("highlightsSection"),
		handler: function(direction) {
			if(direction === "down" && highlight1TriggeredYet === 0) {
				$(".timeline").animate({
					height: "+=90rem"
				}, 5000);
				$("#highlight1").delay(1000).show("slide", { direction: "left" }, 1000);
				highlight1TriggeredYet = 1;
			}
		},
		offset: "75%"
	});

	var highlight2Waypoint = new Waypoint({
		element: document.getElementById("highlightsSection"),
		handler: function(direction) {
			if(direction === "down" && highlight2TriggeredYet === 0) {
				$("#highlight2").delay(2000).show("slide", { direction: "right" }, 1000);
				highlight2TriggeredYet = 1;
			}
		},
		offset: "75%"
	});

	var highlight3Waypoint = new Waypoint({
		element: document.getElementById("highlightsSection"),
		handler: function(direction) {
			if(direction === "down" && highlight3TriggeredYet === 0) {
				$("#highlight3").delay(3000).show("slide", { direction: "left" }, 1000);
				highlight3TriggeredYet = 1;
			}
		},
		offset: "75%"
	});

	var highlight4Waypoint = new Waypoint({
		element: document.getElementById("highlightsSection"),
		handler: function(direction) {
			if(direction === "down" && highlight4TriggeredYet === 0) {
				$("#highlight4").delay(4000).show("slide", { direction: "right" }, 1000);
				highlight4TriggeredYet = 1;
			}
		},
		offset: "75%"
	});



});




function setCarouselHeight(id){
	var slideHeight = [];
	$(id+' .item').each(function(){
		// add all slide heights to an array
		slideHeight.push($(this).height());
	});

	// find the tallest item
	max = Math.max.apply(null, slideHeight)*1.5;

	// set the slide's height
	$(id+' .carousel-content').each(function(){
		$(this).css('height',max+'px');
	});
}