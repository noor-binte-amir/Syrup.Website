// <!--===============================================================================================-->

var restaurant;
var current, comment, username, rating, image;
var signupBtn = document.getElementById('signup');
var signinBtn = document.getElementById('signin');
// document.querySelector('submitbtn1').addClickListener('change', handleFileUploadChange);
set_res_title();
//Create references
var database = firebase.database();
const dbRefRestaurantImages = database.ref().child("Restaurant Images").child(localStorage.getItem('restaurantToSearch'));
const dbRefRestaurant = database.ref().child("Restaurants").child(localStorage.getItem('restaurantToSearch'));
const dbRefRating = database.ref().child("UserInfo").child("User Ratings").child(localStorage.getItem('restaurantToSearch'));
const dbCommentRef = firebase.database().ref().child("UserInfo").child("User Comments").child(localStorage.getItem('restaurantToSearch'));

// <!-- Contribution Uploading -->
document.querySelector(".file-select").addEventListener("change", handleFileUploadChange);
document.querySelector(".file-submit").addEventListener("click", handleFileUploadSubmit);

var selectedFile, selectedFileName;

function handleFileUploadChange(e) {
    selectedFile = e.target.files[0];
    selectedFileName = selectedFile.name;
}


function handleFileUploadSubmit(e) {
    dpRef = storageRef.child(`User Uploads/Contributions/` + firebase.auth().currentUser.uid + "/" + selectedFileName);
    dpRef
        .delete()
        .then(function () {
            // File deleted successfully
        })
        .catch(function (error) {
            // Uh-oh, an error occurred!
        });
    const uploadTask = dpRef.put(selectedFile); //create a child directory called images, and place the file inside this directory
    uploadTask.on(
        "state_changed",
        snapshot => {
            // Observe state change events such as progress, pause, and resume
        },
        error => {
            // Handle unsuccessful uploads
            console.log(error);
            alert("Error Uploading File");
        },
        () => {
            // Do something once upload is complete
            console.log("success");
            uploadTask.snapshot.ref
                .getDownloadURL()
                .then(function (downloadURL) {
                    console.log("File available at", downloadURL);
                    updatePhoto(downloadURL);
                });
            alert("Photo Uploaded");
        }
    );
    // document.getElementById("#dp").src = url;
}


function updatePhoto(downloadURL) {
    var current_userImagesRef = firebase.database().ref().child("UserInfo").child("User Images").child(firebase.auth().currentUser.uid).child("Contributions").push();
    var current_resRef = firebase.database().ref().child("Restaurant Images").child(restaurant).child("Contributions").push();
    // Push a new recommendation to the database using those values
    current_resRef.set({
        image: downloadURL
    });
    current_userImagesRef.set({
        image: downloadURL
    });
}

function userRatingDisplay() {
    firebase.auth().onAuthStateChanged(function (user) {

        if (user) {
            current = user;
            console.log("user.uid, current.uid", user.displayName);
            var userEmail = firebase.auth().currentUser.email;

            getDP(user);

            dbRefRating.child(user.uid).on('value', function (data) {
                console.log(data.val());
                if (data.val().rating != 0) {
                    document.getElementById("#userRating").innerHTML = data.val().rating;
                    (document.getElementById("rating-" + data.val().rating)).checked = true;
                    console.log("user.uid, current.uid", data.val().rating);
                    rating = data.val().rating;

                }
            });

            firebase.database().ref('UserInfo').child('Users').once('value').then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    if (userEmail === childSnapshot.val().email) {
                        username = (childSnapshot.val().username);
                    }

                });
            });

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

function getDP(user) {
    firebase.database().ref("UserInfo").child("User Images").child(user.uid).child(
        "Profile Photo").on('value', function (data) {
        console.log("data", data.val());
        if (data.val()) {
            image = data.val().dp;
            console.log("image", data.val());
        } else {
            image = "https://pngimage.net/wp-content/uploads/2018/06/no-user-image-png-3.png";
        }
    });
}

function getUploads() {
    var restaurantsliderouter1 = document.getElementById('restaurantsliderouter1'); // will inject recycler panels1 into this dynamically
    var restaurantsliderouter2 = document.getElementById('restaurantsliderouter2'); // will inject recycler panels2  into this dynamically
    var restaurantsliderinner1 = document.getElementById('restaurantsliderinner1'); // will inject recycler panels2  into this dynamically
    var restaurantsliderinner2 = document.getElementById('restaurantsliderinner2'); // will inject recycler panels2  into this dynamically

    firebase.database().ref("Restaurant Images").child(restaurant).child("Contributions").on('value', function (data) {
        var k = 0;
        data.forEach(function (key) {

            key.forEach(function (image) {
                console.log("data9", image.val());


                var div1 = document.createElement('div');
                var div2 = document.createElement('div');
                var div3 = document.createElement('div');
                var img = document.createElement('img');

                if (k == 0) {
                    var divcontainer1 = document.createElement('div');
                    divcontainer1.classList.add('container-fluid');

                    divcontainer1.appendChild(restaurantsliderinner1);
                    restaurantsliderouter1.appendChild(divcontainer1);
                }

                if (k == 4) {
                    var divcontainer2 = document.createElement('div');
                    divcontainer2.classList.add('container-fluid');

                    divcontainer2.appendChild(restaurantsliderinner2);
                    restaurantsliderouter2.appendChild(divcontainer2);
                }

                if (k < 4) {
                    div1.classList.add('col-6');
                    div2.classList.add('ct-box');
                    div3.classList.add('inner');
                    img.classList.add('rounded', 'image-fluid');

                    img.src = image.val();

                    div1.appendChild(div2);
                    div2.appendChild(div3);
                    div3.appendChild(img);

                    // Appending to Container
                    restaurantsliderinner1.appendChild(div1);
                }
                if (k >= 4) {
                    div1.classList.add('col-6');
                    div2.classList.add('ct-box');
                    div3.classList.add('inner');
                    img.classList.add('rounded', 'image-fluid');
                    img.src = image.val();

                    div1.appendChild(div2);
                    div2.appendChild(div3);
                    div3.appendChild(img);

                    // Appending to Container
                    restaurantsliderinner2.appendChild(div1);
                }

                k++;
            })
        });
    });
}

function getInsta() {



    var instarecyclerouter1 = document.getElementById('instarecyclerouter1');
    var instarecyclerouter2 = document.getElementById('instarecyclerouter2');
    var instarecyclerinner1 = document.getElementById('instarecyclerinner1');
    var instarecyclerinner2 = document.getElementById('instarecyclerinner2');

    firebase.database().ref("Instagram").child(restaurant).on("value", function (data) {
        var x = 0;
        data.forEach(function (key) {

            var div1 = document.createElement('div');
            div1.classList.add('col-sm-10');

            if (x == 0) {
                var divcontainer1 = document.createElement('div');
                divcontainer1.classList.add('container-fluid');

                divcontainer1.appendChild(instarecyclerinner1);
                instarecyclerouter1.appendChild(divcontainer1);
                div1.innerHTML = key.val().code;
                // Appending to Container
                instarecyclerinner1.appendChild(div1);
            }

            if (x == 1) {
                var divcontainer2 = document.createElement('div');
                divcontainer2.classList.add('container-fluid');

                divcontainer2.appendChild(instarecyclerinner2);
                instarecyclerouter2.appendChild(divcontainer2);

                div1.innerHTML = key.val().code;
                // Appending to Container
                instarecyclerinner2.appendChild(div1);

            }

            if (x == 2) {
                var divcontainer3 = document.createElement('div');
                divcontainer3.classList.add('container-fluid');

                divcontainer3.appendChild(instarecyclerinner3);
                instarecyclerouter3.appendChild(divcontainer3);

                div1.innerHTML = key.val().code;
                // Appending to Container
                instarecyclerinner3.appendChild(div1);
            }

            if (x == 3) {
                var divcontainer4 = document.createElement('div');
                divcontainer4.classList.add('container-fluid');

                divcontainer4.appendChild(instarecyclerinner4);
                instarecyclerouter4.appendChild(divcontainer4);

                div1.innerHTML = key.val().code;
                // Appending to Container
                instarecyclerinner3.appendChild(div1);

            }

            // if(x==3){
            //     var divcontainer2 = document.createElement('div');
            //     divcontainer2.classList.add('container-fluid');

            //     divcontainer2.appendChild(instarecyclerinner2);
            //     instarecyclerouter2.appendChild(divcontainer2);

            //     div1.innerHTML = key.val().code;
            //     // Appending to Container
            //     instarecyclerinner3.appendChild(div1);
            // }

            // if(x<4){
            //     div1.classList.add('col-6');
            //     div2.classList.add('ct-box');
            //     div3.classList.add('inner');
            //     //img.classList.add('rounded');

            //     //img.src = image.val();
            //     div3.innerHTML = key.val().code;

            //     div1.appendChild(div2);
            //     div2.appendChild(div3);
            //     //div3.appendChild(img);

            //     // Appending to Container
            //     instarecyclerinner1.appendChild(div1);
            // }
            // if(x >= 4){
            // div1.classList.add('col-6');
            // div2.classList.add('ct-box');
            // div3.classList.add('inner');
            // //img.classList.add('rounded');
            //     //img.src = image.val();

            //     div1.appendChild(div2);
            //     div2.appendChild(div3);
            //     //div3.appendChild(img);
            //     div3.innerHTML = key.val().code;

            //     // Appending to Container
            //     instarecyclerinner2.appendChild(div1);
            // }

            x++;


        })
    })


}

function setCover() {
    dbRefRestaurantImages.on("value", function (data) {
        (document.getElementById("#restaurantCover")).style.backgroundImage = "url(" + data.val().cover + ")";
        (document.getElementById("#ratingsCover")).style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),url(" + data.val().cover + ")";
        console.log("cover" + data.val()['cover']);
    });
}

function setOverview() {
    dbRefRestaurant.on("value", function (data) {
        rating = data.val().rating;
        (document.getElementById("#address")).innerHTML = data.val().address;
        (document.getElementById("#rating")).innerHTML = data.val().rating;
        (document.getElementById("rating3-" + data.val().rating)).checked = true;
        (document.getElementById("#description")).innerHTML = data.val().description;
        (document.getElementById("#status")).innerHTML = data.val().status;
        (document.getElementById("#timings")).innerHTML = data.val().timings;
        (document.getElementById("#phone")).innerHTML = data.val().phone;
        (document.getElementById("#link")).innerHTML = data.val().link;
        (document.getElementById("#link")).href = data.val().link;
    });
}

function setRatings() {
    dbRefRestaurant.on("value", function (data) {
        (document.getElementById("#ambiance")).setAttribute("data-percentage", data.val().ambiance);
        (document.getElementById("#ambiance-val")).innerHTML = data.val().ambiance + "%";

        (document.getElementById("#taste")).setAttribute("data-percentage", data.val().taste);
        (document.getElementById("#taste-val")).innerHTML = data.val().taste + "%";

        (document.getElementById("#presentation")).setAttribute("data-percentage", data.val().presentation);
        (document.getElementById("#presentation-val")).innerHTML = data.val().presentation + "%";

        (document.getElementById("#value")).setAttribute("data-percentage", data.val().value);
        (document.getElementById("#value-val")).innerHTML = data.val().value + "%";
    });
}

function setUserRating(radio_value) {
    dbRefRating.child(firebase.auth().currentUser.uid).set({
        "rating": radio_value
    });
}

function calculateOverallRating() {
    var totalraters = 1;
    var rating = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    dbRefRating.on('value', function (data) {
        console.log("noor " + data.val());
        totalraters = data.numChildren();
        rating = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        data.forEach(user => {
            dbRefRating.child(user.key).on('value', function (data) {
                rating[data.val().rating - 1] = rating[data.val().rating - 1] + 1;
                console.log("all " + rating);
            })
        });
        overallrating = (10 * rating[9] + 9 * rating[8] + 8 * rating[7] + 7 * rating[6] + 6 * rating[5] + 5 * rating[4] + 4 * rating[3] + 3 * rating[2] + 2 * rating[1] + 1 * rating[0]) / totalraters;
        dbRefRestaurant.update({
            "rating": Math.round(overallrating)
        });
        console.log("overall" + Math.round(overallrating));
    });

}

function showComments() {
    // Get the elements that need to be directly changed or appended to
    var commmentHolder = document.getElementById("#commentStructure");
    // Start Query
    dbCommentRef.on('value', function (data) {
        console.log("comments " + data.key);

        data.forEach(function (uidSnap) {
            console.log("nest" + uidSnap.key);

            uidSnap.forEach(function (messageSnap) {
                console.log("nest" + messageSnap.val().username);

                // Create Elements
                var li = document.createElement('li'); //
                var div1 = document.createElement('div'); //
                var img = document.createElement('img'); //
                var div2 = document.createElement('div'); //
                var div3 = document.createElement('div'); //
                var h6 = document.createElement('h6'); //
                var p1 = document.createElement('p'); //
                var p2 = document.createElement('p'); //
                var span = document.createElement('span'); //
                var br = document.createElement('br'); //

                // // Attach Classes
                li.classList.add('list-group-item');
                div1.classList.add('comments', 'row');
                img.classList.add(
                    'col-3',
                    'avatar',
                    'rounded-circle'
                );
                div2.classList.add('col-9');
                div3.classList.add('row');
                h6.classList.add('username', 'col-12', 'card-subtitle');
                p1.classList.add('date-posted', 'card-text', 'text-muted');
                p2.classList.add('comment', 'card-text');
                span.classList.add('user-rating');

                h6.innerText = messageSnap.val().username;
                p1.innerText = messageSnap.val().timestamp;
                img.src = messageSnap.val().thumbnail;
                span.innerHTML = " Rating: " + messageSnap.val().userrating + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

                // Structure Properly
                // Append things in proper order for example.
                li.appendChild(div1); // first the li to the ul
                div1.appendChild(img); // then the ul to the div.
                div1.appendChild(div2);
                div2.appendChild(div3);
                div3.appendChild(h6);
                div3.appendChild(p1);

                div3.appendChild(p2);
                p2.appendChild(span);
                p2.innerHTML += messageSnap.val().comment;


                // Appending to Container
                commmentHolder.appendChild(li);
            });
        });
    });


}

function postComment(comment, image, username) {
    var d = new Date();
    var strDate = d.toDateString();
    console.log("xx", comment, image, username);

    if (rating != null) {
        sendrating = rating;
    } else {
        sendrating = 0;
    }
    // dbCommentRef.child(firebase.auth().currentUser.uid).push().set({
    //     "comment": comment,
    //     "thumbnail": image,
    //     "timestamp": strDate,
    //     "username": username,
    //     "userrating": sendrating
    // });
    var newRef = dbCommentRef.child(firebase.auth().currentUser.uid);
    newRef.push().set({
        "comment": comment,
        "thumbnail": image,
        "timestamp": strDate,
        "username": username,
        "userrating": sendrating
    });
    alert("Comment Added!");
}


function embedInsta(embed) {
    var embedRef = database
        .ref()
        .child("Instagram")
        .child(restaurant)
        .push()
        .set({
            code: embed
        });
    alert("Embedded!");
}


$(document).ready(function () {
    $(".rating-grouptwo > label").on("click", function (event) {
        radio_value = $(this).next("input[type='radio']").val();
        setUserRating(radio_value);
        calculateOverallRating();
    });

    $("#submitbtn1").on("click", function (event) {
        comment = $("[name=message]").val();
        console.log("watnow");
        postComment(comment, image, username);
    });
    $("#embedbtn").on("click", function (event) {
        var embed = $("[name=embed]").val();
        embedInsta(embed);
    });
});

// getUploads();
// <!--===============================================================================================-->
function set_res_title() {
    var restaurant_title = document.getElementById('restaurantName');
    restaurant = localStorage.getItem('restaurantToSearch');
    // console.log(restaurant);
    // restaurant = "Cafe Garage";
    restaurant_title.innerText = restaurant;
}

function wish_handler(user) {
    var wishlistBtn = document.getElementById('wishlistbtn');

    wishlistBtn.addEventListener('click', function () {

        restaurant_title = document.getElementById('restaurantName');
        restaurant = localStorage.getItem('restaurantToSearch');
        console.log(restaurant);
        restaurant_title.innerText = restaurant;
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

function wishlist(user) {

    var recyclerPanelsContainer = document.getElementById('recyclerPanelsContainerone'); // will inject recycler panels1 into this dynamically
    var recyclerPanelsContainer2 = document.getElementById('recyclerPanelsContainertwo'); // will inject recycler panels2  into this dynamically
    const db2 = firebase.database().ref(); // Get the Database Ref at Root
    // USER WISHLIST DISPLAY

    newdb = db2.child('UserInfo/User Wishlists'); // Get the Database Ref at Root
    newdb.child(user.uid).once('value').then(function (snap) {

        // console.log(user.uid);
        //console.log("nest" + snapShot.key);
        snap.forEach(function (childsnap) {
            var wishRes = childsnap.val().resname;
            //console.log(childsnapshot.val);
            console.log(childsnap.key);

            // childName loops through the list of Resturant Names Recieved under the category.
            db2.child('Restaurants').child(wishRes).once(
                // The I Get the data of just that restaurant (childName) in the Resturants Table.
                'value').then(
                function (resSnapshot) {
                    // Here I have the data of Exactly one Resturant.
                    // This loop will have specific data everytime the outer loop chnages the child name childName.

                    // Log for debugging
                    console.log(resSnapshot);

                    const restaurantitems = resSnapshot.val(); // extract data

                    // Log for debugging
                    console.log(resSnapshot.key);
                    console.log(restaurantitems['location']);
                    console.log(restaurantitems['category']);
                    console.log(restaurantitems['image']);

                    //div to be made dynamically
                    // <div class="item col-12 right" >
                    //      <div class="container-fluid">
                    //           <div class="row" >
                    //                <div class="d-none d-lg-block col-lg-3">
                    //                      <div class="ct-box">
                    //                          <div class="inner" role="presentation"><img src="images/contribute8.jpg" alt=""
                    //                           class="img-fluid rounded"></div>
                    //                       </div>
                    //                 </div>
                    //             </div>
                    //       </div>
                    //  </div>

                    var div1 = document.createElement('div');
                    var div2 = document.createElement('div');
                    var div3 = document.createElement('div');
                    var img = document.createElement('img');

                    div1.classList.add('col-lg-3', 'd-none', 'd-lg-block');
                    div2.classList.add('ct-box');
                    div3.classList.add('inner');
                    img.classList.add('img-fluid', 'rounded');

                    img.src = restaurantitems['image'];

                    div1.appendChild(div2);
                    div2.appendChild(div3);
                    div3.appendChild(img);

                    // Appending to Container
                    recyclerPanelsContainer.appendChild(div1);


                });
        });
    });
}

// <!--===============================================================================================-->
calculateOverallRating();
userRatingDisplay();
setCover();
setOverview();
getUploads();
setRatings();
showComments();
getInsta();