$(window).on("scroll", function() {
    if ($(window).scrollTop() > 500) {
        $(".header").addClass("active");
        $("div.dropdown-menu.show").addClass("active");
        $("div.dropdown-menu").addClass("active");
        $("a.btn-link-3").addClass("active");
        $(".fas.fa-bars").addClass("active");
    } else {
        //remove the background property so it comes transparent again (defined in your css)
        $(".header").removeClass("active");
        $("div.dropdown-menu.show").removeClass("active");
        $("div.dropdown-menu").removeClass("active");
        $("a.btn-link-3").removeClass("active");
        $(".fas.fa-bars").removeClass("active");
    }
});
