$(document).ready(function() {
    //  Scrollify Library Function Initialization
    $(function() {
        $.scrollify({
            section: '.scroll', // WILL SCROLL ONLY ELEMENTS WITH CLASS 'block'
            scrollbars: true,
            scrollSpeed: 700,
            easing: 'swing',

            before: function(index) {},
        });
    });
});
