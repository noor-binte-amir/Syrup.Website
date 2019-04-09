function nav_setting() {
    firebase.auth().onAuthStateChanged(function (user) {

        if (user) {
            signupBtn = document.getElementById('signup');
            signinBtn = document.getElementById('signin');
            signupBtn.style.visibility = 'hidden';
            signinBtn.style.visibility = 'hidden';
        } else {

        }

    });
}


function generate_dynamic_panels() {


    const db = firebase.database().ref();
    var topRatedRestaurants = db.child('Restaurants/').orderByChild('rating').limitToLast(8);

    //var topRatedRestaurants_desc = reverseObject(topRatedRestaurants);

    console.log(db.child('Restaurants/').orderByChild('rating'));

    topRatedRestaurants.once('value', function (snapNames) {
        var i = 0;


        snapNames.forEach(function (childName) {
            // childName loops through the list of Resturant Names Recieved under the category.
            db.child('Restaurants/' + childName.key).once(
                // The I Get the data of just that restaurant (childName) in the Resturants Table.
                'value',
                function (resSnaps) {
                    // Here I have the data of Exactly one Resturant.
                    // This loop will have specific data everytime the outer loop chnages the child name childName.
                    const restaurantData = resSnaps.val(); // extract data

                    // Log for debugging
                    console.log(resSnaps.key);
                    console.log(restaurantData['location']);
                    console.log(restaurantData['category']);
                    console.log(restaurantData['image']);
                    console.log(restaurantData['rating']);

                    //  -- Folow Steps in This Order Please --

                    // Create Elements  -- For Hamna --
                    var div = document.createElement('div');
                    var ul = document.createElement('ul');
                    var li = document.createElement('li');
                    var img = document.createElement('img');
                    var a = document.createElement('a');
                    var p = document.createElement('p');
                    var b = document.createElement('b');
                    var span = document.createElement('span');

                    console.log(a);

                    // Attach Classes -- For Hamna --
                    div.classList.add('col-md-3', 'col-6', 'divPositioning', 'wrap');
                    ul.classList.add('verticalAlignText');
                    li.innerText = restaurantData['speciality'];
                    img.classList.add(
                        'centered',
                        'imageTranslate',
                        'imagePositioning',
                        'img-fluid'
                    );
                    img.src = restaurantData['image'];
                    a.setAttribute('href', '#');
                    console.log(a);
                    p.classList.add('homeContainer');
                    b.innerText = resSnaps.key;
                    span.innerText = resSnaps.key;

                    // Structure Properly -- For Hamna --
                    // Append things in proper order for example.
                    ul.appendChild(li); // first the li to the ul
                    div.appendChild(ul); // then the ul to the div.
                    div.appendChild(img);
                    a.appendChild(p);
                    console.log(a);
                    p.appendChild(b);
                    console.log(p);
                    div.appendChild(a);
                    div.appendChild(span);


                    // Appending to Container
                    panelsContainer.appendChild(div);

                    $(b).click(function (e) {
                        e.preventDefault();
                        var resNode = e.target;
                        var resName = resNode.innerText.trim();
                        console.log(resName);
                        localStorage.setItem('restaurantToSearch', resName);
                        window.location = 'Restaurant.html';
                    });
                }
            );
        });
    });
}

nav_setting();
generate_dynamic_panels();