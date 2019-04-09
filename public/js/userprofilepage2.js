
        function signoutUser(){

           document.getElementById('signout').addEventListener('click', function(){
               firebase.auth().signOut();
               location.href="Sign-in.html";
           });

        }

        function wishlist(user){

            var recyclerPanelsContainer = document.getElementById('recyclerPanelsContainerone'); // will inject recycler panels1 into this dynamically
            var recyclerPanelsContainer2 = document.getElementById('recyclerPanelsContainertwo'); // will inject recycler panels2  into this dynamically
            const db2 = firebase.database().ref(); // Get the Database Ref at Root
// USER WISHLIST DISPLAY

               newdb = db2.child('UserInfo/User Wishlists'); // Get the Database Ref at Root
               newdb.child(user.uid).once('value').then (function(snap){

                  // console.log(user.uid);
                   //console.log("nest" + snapShot.key);
                   snap.forEach(function(childsnap){
                       var wishRes = childsnap.val().resname;
                       //console.log(childsnapshot.val);
                       console.log(childsnap.key);

                   // childName loops through the list of Resturant Names Recieved under the category.
                   db2.child('Restaurants').child(wishRes).once(
                       // The I Get the data of just that restaurant (childName) in the Resturants Table.
                       'value').then(
                       function(resSnapshot) {
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

        function favorites(user){
            // GET USER FAVORITES
            const db2 = firebase.database().ref(); // Get the Database Ref at Root
            const db1 = firebase.database().ref().child('UserInfo/User Favourites'); // Get the Database Ref at Root
           var favPanelsContainer = document.getElementById('favPanelsContainer'); // will inject restaurants panels into this dynamically
            db1.child(user.uid).once('value').then (function(snapShot){

               // console.log(user.uid);
                //console.log("nest" + snapShot.key);

                snapShot.forEach(function(childsnapshot){
                    var favoriteRes = childsnapshot.val().resname;
                    //console.log(childsnapshot.val);
                    console.log(childsnapshot.key);

                // childName loops through the list of Resturant Names Recieved under the category.
                db2.child('Restaurants').child(favoriteRes).once(
                    // The I Get the data of just that restaurant (childName) in the Resturants Table.
                    'value').then(
                    function(resSnaps) {
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

                        div.classList.add('col-lg-4', 'col-md-6',);
                        img.classList.add('imagePlacement');

                        img.src = restaurantData['image'];
                        h2.innerText =  resSnaps.key.toUpperCase();
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


        function recommendations(user){

// GET USER RECOMMENDATIONS:

               const db1 = firebase.database().ref().child('UserInfo/User Favourites'); // Get the Database Ref at Root
               const db2 = firebase.database().ref(); // Get the Database Ref at Root
               db1.child(user.uid).once('value').then (function(snapShot){

                // console.log(user.uid);
                 //console.log("nest" + snapShot.key);

                 snapShot.forEach(function(childsnapshot){
                     var favoriteRes = childsnapshot.val().resname;
                     //console.log(childsnapshot.val);
                     console.log(childsnapshot.key);

                 // childName loops through the list of Resturant Names Recieved under the category.
                 db2.child('Restaurants').child(favoriteRes).once(
                     // The I Get the data of just that restaurant (childName) in the Resturants Table.
                     'value').then(
                     function(resSnaps) {
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

                         db2.child('Categories/' + recommend_category).once('value', function(snapNames) {

                             snapNames.forEach(function(childName) {
                                 // childName loops through the list of Resturant Names Recieved under the category.
                                 db2.child('Restaurants/' + childName.key).once(
                                 // The I Get the data of just that restaurant (childName) in the Resturants Table.
                                 'value',
                                 function(resSnap) {
                                         // Here I have the data of Exactly one Resturant.
                                         // This loop will have specific data everytime the outer loop chnages the child name childName.
                                         const restaurantDetails = resSnap.val(); // extract data
                                         var recommend_res = resSnap.key;
                                         // Log for debugging
                                         console.log(resSnap.key);
                                         console.log(restaurantDetails['location']);
                                         console.log(restaurantDetails['category']);
                                         console.log(restaurantDetails['image']);

                                         if(fav_res != recommend_res){

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

                                             div.classList.add('col-lg-4', 'col-md-6',);
                                             img.classList.add('imagePlacement');

                                             img.src = restaurantDetails['image'];
                                             h2.innerText =  resSnap.key.toUpperCase();
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



       function userDataDisplay(){

           //var user = firebase.auth().currentUser;
           const displayName = document.getElementById("userName");
           const displayContact = document.getElementById("userContact");
           const displayfbName = document.getElementById("fbName");
           const displayinstaName = document.getElementById("instaName");

           var recommendPanelsContainer = document.getElementById('recommendPanelsContainer'); // will inject favorite panels into this dynamically
                     firebase.auth().onAuthStateChanged(function(user) {

               if (user) {
                   console.log(user.uid);
                   var userEmail = firebase.auth().currentUser.email;
                   console.log(userEmail);
                   firebase.database().ref('UserInfo/Users').once('value').then(function(snapshot) {
                   snapshot.forEach(function(childSnapshot){
                       if(userEmail === childSnapshot.val().email){
                           var username = (childSnapshot.val().username);
                           displayName.innerText = username;
                           displayfbName.innerText = username;
                           displayinstaName.innerText = username;

                           console.log(childSnapshot.val().contact);

                           var usercontact = (childSnapshot.val().contact);
                           displayContact.innerText = usercontact;


                           //console.log(childSnapshot.val().usercontact);
                       }

 });
});

                    wishlist(user);
                    favorites(user);
                    recommendations(user);


               }


               else {
                   // No user is signed in.
                   window.location.href = 'Sign-in.html'
                   console.log("nothing");
               }
   });

       }


        userDataDisplay();
        signoutUser();