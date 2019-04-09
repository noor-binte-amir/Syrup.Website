$(document).ready(function() {
    $('.menu-items').slideUp('fast');

    $('.menu-titles').click(function(e) {
        e.preventDefault();
        $target = $(this);
        $icon = $target.find('i').eq(0);
        console.log($icon);
        $items = $target.next();
        console.log($items);

        $items.slideToggle('slow');

        // $items.toggleClass('menu-items-toggle');
        $icon.toggleClass('icon-rotate');
    });
});
