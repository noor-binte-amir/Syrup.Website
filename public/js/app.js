// Initialize Firebase
var config = {
    apiKey: "AIzaSyBerqgdPGGc4xkX-GSju3Xnxcla3vU_jU4",
    authDomain: "syrup-6e640.firebaseapp.com",
    databaseURL: "https://syrup-6e640.firebaseio.com",
    projectId: "syrup-6e640",
    storageBucket: "syrup-6e640.appspot.com",
    messagingSenderId: "428019578808"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

// Get a reference to the storage service, which is used to create references in your storage bucket
var storage = firebase.storage();

// Create a storage reference from our storage service
var storageRef = storage.ref();

//Create references
const dbRefRestaurants = database.ref().child("Restaurants");

//Sync Object Changes
dbRefRestaurants.on("child_added", function (data) {
    console.log("test" + data.key);
});

// dbRefRestaurants.set({
//     category: "Fast Food",
//     image: "https://firebasestorage.googleapis.com/v0/b/syrup-6e640.appspot.com/o/Restaurant%20Panels%2FKFC.jpg?alt=media&token=96279276-e4a7-482e-9900-59ee716c7ddf"
// })