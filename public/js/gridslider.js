$(document).ready(function() {
    $('.ct-box-slider-1').slick({
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false,
    });

    $('#ct-js-box-slider--next-1').on('click', function() {
        $('.ct-box-slider-1').slick('slickNext');
    });

    $('.ct-box-slider-2').slick({
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false,
    });

    $('#ct-js-box-slider--next-2').on('click', function() {
        $('.ct-box-slider-2').slick('slickNext');
    });
});
