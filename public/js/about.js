$(document).ready(function() {
    // ARRAY FOR COLOR CHANGES
    const colors = [
        '#FF6666',
        '#E6AE32',
        '#E12F37',
        'yellow',
        'black',
        'brown',
    ];

    //  Scrollify Library Function Initialization
    $(function() {
        var before = 0;
        var after;
        $.scrollify({
            section: '.block', // WILL SCROLL ONLY ELEMENTS WITH CLASS 'block'
            scrollbars: false,
            scrollSpeed: 700,
            easing: 'swing',

            before: function(index) {
                after = index;

                // FIRST
                if (before == 0 && after == 1) {
                    $('.teaser').addClass('scroll-one');
                    before = 1;
                } else if (before == 1 && after == 0) {
                    $('.teaser').removeClass('scroll-one');
                    before = 0;
                }

                // SECOND

                if (before == 1 && after == 2) {
                    $('.teaser').addClass('scroll-two');
                    before = 2;
                } else if (before == 2 && after == 1) {
                    $('.teaser').removeClass('scroll-two');
                    before = 1;
                }
                // THIRD

                if (before == 2 && after == 3) {
                    $('.teaser').addClass('scroll-three');
                    before = 3;
                } else if (before == 3 && after == 2) {
                    $('.teaser').removeClass('scroll-three');
                    before = 2;
                }
            },
        });
    });
});
