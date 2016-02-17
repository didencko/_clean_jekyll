(function ($) {
	'use strict';
	$(document).ready(function () {

		//SVG Fallback
		if(!Modernizr.svg) {
			$("img[src*='svg']").attr("src", function() {
				return $(this).attr("src").replace(".svg", ".png");
			});
		}; // end svg fallback

		//Ajax отправка форм
		$("form").submit(function() { //Change
			var th = $(this);
			$.ajax({
				type: "POST",
				url: "mail.php", //Change
				data: th.serialize()
			}).done(function() {
				alert("Thank you!");
				setTimeout(function() {
					// Done Functions
					th.trigger("reset");
				}, 1000);
			});
			return false;
		}); //end ajax

		//Chrome Smooth Scroll
		try {
			$.browserSelector();
			if($("html").hasClass("chrome")) {
				$.smoothScroll();
			}
		} catch(err) {

		}; // end chrome smooth scroll

		$("img, a").on("dragstart", function(event) { event.preventDefault();});

	}); // end ready
}(jQuery));
