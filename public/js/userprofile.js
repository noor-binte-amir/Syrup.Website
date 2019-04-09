var current;

window.onload = function () {
    const dbCommentRef = firebase
        .database()
        .ref()
        .child("UserInfo")
        .child("User Comments");
    userDataDisplay();
    signoutUser();
    showComments(dbCommentRef);
};

function signoutUser() {
    document.getElementById("signout").addEventListener("click", function () {
        firebase.auth().signOut();
        location.href = "Sign-in.html";
    });
}

function userDataDisplay() {
    const displayName = document.getElementById("userName");
    const displayContact = document.getElementById("userContact");
    const displayfbName = document.getElementById("fbName");
    const displayinstaName = document.getElementById("instaName");
    var dp = document.getElementById("#dp");

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            current = user;
            console.log(user.uid, current.uid);
            var userEmail = firebase.auth().currentUser.email;
            console.log(userEmail);
            firebase
                .database()
                .ref("UserInfo")
                .child("Users")
                .once("value")
                .then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        if (userEmail === childSnapshot.val().email) {
                            var username = childSnapshot.val().username;
                            displayName.innerText = username;
                            displayfbName.innerText = username;
                            displayinstaName.innerText = username;

                            console.log(childSnapshot.val().contact);

                            var usercontact = childSnapshot.val().contact;
                            displayContact.innerText = usercontact;
                            getUploads(user);

                        }
                    });
                });

            firebase
                .database()
                .ref("UserInfo")
                .child("User Images")
                .child(firebase.auth().currentUser.uid)
                .child("Profile Photo")
                .on("value", function (data) {
                    console.log(data.val());
                    if (data.val()) {
                        dp.src = data.val().dp;
                    }
                });

            wishlist(user);
            favorites(user);
            recommendations(user);
        } else {
            // No user is signed in.
            console.log("nothing");
        }
    });
}
// <!--===============================================================================================-->

// <!-- DP Uploading -->
document
    .querySelector(".file-select")
    .addEventListener("change", handleFileUploadChange);
document
    .querySelector(".file-submit")
    .addEventListener("click", handleFileUploadSubmit);

var selectedFile;

function handleFileUploadChange(e) {
    selectedFile = e.target.files[0];
}

function handleFileUploadSubmit(e) {
    dpRef = storageRef.child(`User Uploads/Profile Pictures/` + current.uid);
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
            alert("Profile Photo Updated");
        }
    );
    document.getElementById("#dp").src = url;
}

function updatePhoto(downloadURL) {
    var current_dpRef = firebase
        .database()
        .ref()
        .child("UserInfo")
        .child("User Images")
        .child(current.uid)
        .child("Profile Photo");
    // Delete the file
    current_dpRef.remove();
    // Push a new recommendation to the database using those values
    current_dpRef.set({
        dp: downloadURL
    });
}

function showComments(dbCommentRef) {
    // Get the elements that need to be directly changed or appended to
    var commmentHolder = document.getElementById("#commentStructure");

    dbCommentRef.on("value", function (data) {
        console.log("1data " + data.key);

        data.forEach(function (resSnap) {
            console.log("1nest1" + resSnap.key);

            resSnap.forEach(function (uidSnap) {
                if (uidSnap.key == current.uid) {
                    console.log("2nest2" + uidSnap.key);
                    uidSnap.forEach(function (messageSnap) {
                        console.log("3nest3" + messageSnap.key);

                        // Create Elements
                        var li = document.createElement("li"); //
                        var div1 = document.createElement("div"); //
                        var img = document.createElement("img"); //
                        var div2 = document.createElement("div"); //
                        var div3 = document.createElement("div"); //
                        var h6 = document.createElement("h6"); //
                        var p1 = document.createElement("p"); //
                        var p2 = document.createElement("p"); //
                        var span = document.createElement("span"); //

                        // // Attach Classes
                        li.classList.add("list-group-item");
                        div1.classList.add("comments", "row");
                        img.classList.add("col-3", "avatar", "rounded-circle");
                        div2.classList.add("col-9");
                        div3.classList.add("row");
                        h6.classList.add("username", "col-12", "card-subtitle");
                        p1.classList.add(
                            "date-posted",
                            "card-text",
                            "text-muted"
                        );
                        p2.classList.add("comment", "card-text");
                        span.classList.add("user-rating");

                        h6.innerText = messageSnap.val().username;
                        p1.innerHTML = messageSnap.val().timestamp;
                        img.src = messageSnap.val().thumbnail;
                        span.innerText =
                            "Rating: " + messageSnap.val().userrating;

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
                }
            });
        });
    });
    // Start Query
    // dbCommentRef.on('value', function (data) {
    //     // console.log("comments " + data.key);

    //     data.forEach(function (uidSnap) {
    //         // console.log("nest" + uidSnap.key);

    //         uidSnap.forEach(function (messageSnap) {
    //             // console.log("nest" + messageSnap.val().username);

    //         });
    //     });
    // });
}

function getUploads(user) {

    var uploadsliderouter1 = document.getElementById('uploadsliderouter1'); // will inject recycler panels1 into this dynamically
    var uploadsliderouter2 = document.getElementById('uploadsliderouter2'); // will inject recycler panels2  into this dynamically
    var uploadsliderouter3 = document.getElementById('uploadsliderouter3'); // will inject recycler panels2  into this dynamically
    var uploadsliderinner1 = document.getElementById('uploadsliderinner1'); // will inject recycler panels2  into this dynamically
    var uploadsliderinner2 = document.getElementById('uploadsliderinner2'); // will inject recycler panels2  into this dynamically
    var uploadsliderinner3 = document.getElementById('uploadsliderinner3'); // will inject recycler panels2  into this dynamically

    console.log("xzzzzz", user.uid);
    firebase.database().ref("UserInfo").child("User Images").child(user.uid).child("Contributions").on('value', function (data) {
        var j = 0;
        data.forEach(function (key) {

            key.forEach(function (image) {
                console.log("data10", image.val());

                var div1 = document.createElement('div');
                var div2 = document.createElement('div');
                var div3 = document.createElement('div');
                var img = document.createElement('img');

                if(j== 0){
                    var divcontainer1 = document.createElement('div');
                    divcontainer1.classList.add('container-fluid');

                    divcontainer1.appendChild(uploadsliderinner1);
                    uploadsliderouter1.appendChild(divcontainer1);
                }

                if(j==4){
                    var divcontainer2 = document.createElement('div');
                    divcontainer2.classList.add('container-fluid');

                    divcontainer2.appendChild(uploadsliderinner2);
                    uploadsliderouter2.appendChild(divcontainer2);
                }

                if(j==8){
                    var divcontainer3 = document.createElement('div');
                    divcontainer3.classList.add('container-fluid');

                    divcontainer3.appendChild(uploadsliderinner3);
                    uploadsliderouter3.appendChild(divcontainer3);
                }

                if(j < 4){
                    div1.classList.add('col-6');
                    div2.classList.add('ct-box');
                    div3.classList.add('inner');
                    img.classList.add('img-fluid', 'rounded');

                    img.src = image.val();

                    div1.appendChild(div2);
                    div2.appendChild(div3);
                    div3.appendChild(img);

                    // Appending to Container
                    uploadsliderinner1.appendChild(div1);
                }

                if(j >= 4 && j< 8){
                    div1.classList.add('col-6');
                    div2.classList.add('ct-box');
                    div3.classList.add('inner');
                    img.classList.add('img-fluid', 'rounded');

                    img.src = image.val();

                    div1.appendChild(div2);
                    div2.appendChild(div3);
                    div3.appendChild(img);

                    // Appending to Container
                    uploadsliderinner2.appendChild(div1);
                }

                if( j >=8){
                    div1.classList.add('col-6');
                    div2.classList.add('ct-box');
                    div3.classList.add('inner');
                    img.classList.add('img-fluid', 'rounded');

                    img.src = image.val();

                    div1.appendChild(div2);
                    div2.appendChild(div3);
                    div3.appendChild(img);

                    // Appending to Container
                    uploadsliderinner3.appendChild(div1);
                }

                console.log("j = ", j);
                j++;



            })
        });
    });
}

function wishlist(user) {
var i = 0;
    var recyclerPanelsContainerouter1 = document.getElementById('recyclerPanelsContainerouter1'); // will inject recycler panels1 into this dynamically
    var recyclerPanelsContainerouter2 = document.getElementById('recyclerPanelsContainerouter2'); // will inject recycler panels1 into this dynamically
    var recyclerPanelsContainerinner1 = document.getElementById('recyclerPanelsContainerinner1'); // will inject recycler panels2  into this dynamically
    var recyclerPanelsContainerinner2 = document.getElementById('recyclerPanelsContainerinner2'); // will inject recycler panels2  into this dynamically
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
                    console.log("resimg", restaurantitems['image']);

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

                    var divdnone = document.createElement('div');
                            var divct = document.createElement('div');
                            var divinner = document.createElement('div');
                            var img = document.createElement('img');


                            if(i == 0){
                                var divcontainer1 = document.createElement('div');
                                divcontainer1.classList.add('container-fluid');

                                divcontainer1.appendChild(recyclerPanelsContainerinner1);
                                recyclerPanelsContainerouter1.appendChild(divcontainer1);

                            }

                            if(i==8){
                                var divcontainer2 = document.createElement('div');
                                divcontainer2.classList.add('container-fluid');

                                divcontainer2.appendChild(recyclerPanelsContainerinner2);
                                recyclerPanelsContainerouter2.appendChild(divcontainer2);
                            }
                            if(i < 8){
                                divdnone.classList.add('col-lg-3', 'd-none', 'd-lg-block');
                                divct.classList.add('ct-box');
                                divinner.classList.add('inner');
                                img.classList.add('img-fluid', 'rounded');

                                img.src = restaurantitems['image'];

                                //divrow.appendChild(divdnone);
                                divdnone.appendChild(divct);
                                divct.appendChild(divinner);
                                divinner.appendChild(img);

                                // Appending to Container
                                recyclerPanelsContainerinner1.appendChild(divdnone);
                            }
                            if(i>=8){
                                divdnone.classList.add('col-lg-3', 'd-none', 'd-lg-block');
                                divct.classList.add('ct-box');
                                divinner.classList.add('inner');
                                img.classList.add('img-fluid', 'rounded');

                                img.src = restaurantitems['image'];

                                //divrow.appendChild(divdnone);
                                divdnone.appendChild(divct);
                                divct.appendChild(divinner);
                                divinner.appendChild(img);

                                // Appending to Container
                                recyclerPanelsContainerinner2.appendChild(divdnone);
                            }


                           console.log(i);
                           i++;


                });
        });
    });
}

function favorites(user) {
    // GET USER FAVORITES
    const db2 = firebase.database().ref(); // Get the Database Ref at Root
    const db1 = firebase.database().ref().child('UserInfo/User Favourites'); // Get the Database Ref at Root
    var favPanelsContainer = document.getElementById('favPanelsContainer'); // will inject restaurants panels into this dynamically
    db1.child(user.uid).once('value').then(function (snapShot) {

        // console.log(user.uid);
        //console.log("nest" + snapShot.key);

        snapShot.forEach(function (childsnapshot) {
            var favoriteRes = childsnapshot.val().resname;
            //console.log(childsnapshot.val);
            console.log(childsnapshot.key);

            // childName loops through the list of Resturant Names Recieved under the category.
            db2.child('Restaurants').child(favoriteRes).once(
                // The I Get the data of just that restaurant (childName) in the Resturants Table.
                'value').then(
                function (resSnaps) {
                    // Here I have the data of Exactly one Resturant.
                    // This loop will have specific data everytime the outer loop chnages the child name childName.

                    // Log for debugging
                    console.log(resSnaps);

                    const restaurantData = resSnaps.val(); // extract data

                    // Log for debugging
                    console.log(resSnaps.key);
                    console.log(restaurantData['location']);
                    console.log(restaurantData['category']);
                    console.log(restaurantData['image']);

                    //div to be made dynamically

                    // <div class="col-lg-4 col-md-6">
                    //     <img class="imagePlacement" src="images/favorite1.jpg" />
                    //     <h2>BRITISH FISH CAKES</h2>
                    //     <p>delicious warm fish cakes served with out special sauce with herbs sprinkled on the top, with potato
                    //         wedges
                    //         as a sideline</p>
                    // </div>

                    var div = document.createElement('div');
                    var img = document.createElement('img');
                    var h2 = document.createElement('h2');
                    var p = document.createElement('p');
                    var span = document.createElement('span');

                    div.classList.add('col-lg-4', 'col-md-6', );
                    img.classList.add('imagePlacement');

                    img.src = restaurantData['image'];
                    h2.innerText = resSnaps.key.toUpperCase();
                    p.innerText = restaurantData['category'];

                    div.appendChild(img);
                    div.appendChild(h2);
                    div.appendChild(p);

                    // Appending to Container
                    favPanelsContainer.appendChild(div);


                });
        });
    });
}


function recommendations(user) {

    // GET USER RECOMMENDATIONS:

    const db1 = firebase.database().ref().child('UserInfo/User Favourites'); // Get the Database Ref at Root
    const db2 = firebase.database().ref(); // Get the Database Ref at Root
    db1.child(user.uid).once('value').then(function (snapShot) {

        // console.log(user.uid);
        //console.log("nest" + snapShot.key);

        snapShot.forEach(function (childsnapshot) {
            var favoriteRes = childsnapshot.val().resname;
            //console.log(childsnapshot.val);
            console.log(childsnapshot.key);

            // childName loops through the list of Resturant Names Recieved under the category.
            db2.child('Restaurants').child(favoriteRes).once(
                // The I Get the data of just that restaurant (childName) in the Resturants Table.
                'value').then(
                function (resSnaps) {
                    // Here I have the data of Exactly one Resturant.
                    // This loop will have specific data everytime the outer loop chnages the child name childName.

                    // Log for debugging
                    console.log(resSnaps);

                    const restaurantData = resSnaps.val(); // extract data

                    var recommend_category = restaurantData['category'];
                    var fav_res = resSnaps.key;

                    // Log for debugging
                    console.log(resSnaps.key);
                    console.log(restaurantData['location']);
                    console.log(restaurantData['category']);
                    console.log(restaurantData['image']);

                    db2.child('Categories/' + recommend_category).once('value', function (snapNames) {

                        snapNames.forEach(function (childName) {
                            // childName loops through the list of Resturant Names Recieved under the category.
                            db2.child('Restaurants/' + childName.key).once(
                                // The I Get the data of just that restaurant (childName) in the Resturants Table.
                                'value',
                                function (resSnap) {
                                    // Here I have the data of Exactly one Resturant.
                                    // This loop will have specific data everytime the outer loop chnages the child name childName.
                                    const restaurantDetails = resSnap.val(); // extract data
                                    var recommend_res = resSnap.key;
                                    // Log for debugging
                                    console.log(resSnap.key);
                                    console.log(restaurantDetails['location']);
                                    console.log(restaurantDetails['category']);
                                    console.log(restaurantDetails['image']);

                                    if (fav_res != recommend_res) {

                                        console.log(resSnap.key);
                                        console.log(restaurantDetails['location']);
                                        console.log(restaurantDetails['category']);
                                        console.log(restaurantDetails['image']);

                                        //div to be made dynamically

                                        // <div class="col-lg-4 col-md-6">
                                        //     <img class="imagePlacement" src="images/favorite1.jpg" />
                                        //     <h2>BRITISH FISH CAKES</h2>
                                        //     <p>delicious warm fish cakes served with out special sauce with herbs sprinkled on the top, with potato
                                        //         wedges
                                        //         as a sideline</p>
                                        // </div>


                                        var div = document.createElement('div');
                                        var img = document.createElement('img');
                                        var h2 = document.createElement('h2');
                                        var p = document.createElement('p');

                                        div.classList.add('col-lg-4', 'col-md-6', );
                                        img.classList.add('imagePlacement');

                                        img.src = restaurantDetails['image'];
                                        h2.innerText = resSnap.key.toUpperCase();
                                        p.innerText = restaurantDetails['category'];

                                        div.appendChild(img);
                                        div.appendChild(h2);
                                        div.appendChild(p);

                                        // Appending to Container
                                        recommendPanelsContainer.appendChild(div);



                                    }

                                    //  -- Folow Steps in This Order Please --
                                });
                        });
                    });



                });
        });
    });
}