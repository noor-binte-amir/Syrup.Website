jQuery(document).ready(function() {
    /*
	    Navigation
	*/
    // toggle "navbar-no-bg" class
    $('.category-section').waypoint(function() {
        $('nav').toggleClass('navbar-no-bg');
        console.log('test');
    });

    /*
        Wow
    */
    // new WOW().init();
});
