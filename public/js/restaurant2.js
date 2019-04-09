function set_res_title() {
    var restaurant_title = document.getElementById('restaurantName');
    var restaurant = localStorage.getItem('restaurantToSearch');
    console.log(restaurant);
    restaurant_title.innerText = restaurant;
}

function wish_handler(user) {
    var wishlistBtn = document.getElementById('wishlistbtn');

    wishlistBtn.addEventListener('click', function () {
        restaurant = localStorage.getItem('restaurantToSearch');
        console.log(restaurant);
        // wishlistBtn = document.getElementById('wishlistbtn');
        // var wishlistStar = document.getElementById('wishliststar');

        console.log(user.uid);
        var userUID = firebase.auth().currentUser.uid;
        const db = firebase.database().ref();
        var userWishlist = db.child('UserInfo/User Wishlists');
        console.log(userWishlist);
        userWishlist.child(user.uid).push({
            "resname": restaurant
        });

        wishlistBtn.style.backgroundColor = 'gray';
    });
}

function fav_handler(user) {
    var favBtn = document.getElementById('favbtn');


    favBtn.addEventListener('click', function () {

        restaurant = localStorage.getItem('restaurantToSearch');
        console.log(restaurant);
        console.log(user.uid);
        var userUID = firebase.auth().currentUser.uid;
        const db = firebase.database().ref();
        var userFavorites = db.child('UserInfo/User Favourites');
        console.log(userFavorites);
        userFavorites.child(user.uid).push({
            "resname": restaurant
        });

        favBtn.style.backgroundColor = 'gray';
    });
}

function restauranthandler() {

    firebase.auth().onAuthStateChanged(function (user) {

        if (user) {

            signupBtn = document.getElementById('signup');
            signinBtn = document.getElementById('signin');
            signupBtn.style.visibility = 'hidden';
            signinBtn.style.visibility = 'hidden';

            fav_handler(user);
            wish_handler(user);

        } else {
            // No user is signed in.
            wishlistBtn.style.visibility = 'hidden';
            favBtn.style.visibility = 'hidden';
            console.log("button should be hidden");
        }


    });
}

set_res_title();
restauranthandler()