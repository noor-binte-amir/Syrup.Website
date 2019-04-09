/**
         * Handles the sign up button press.
         */
        function handleSignUp() {
            // alert('Please enter an email address.');
            var email = document.getElementById('email').value;
            var password = document.getElementById('password').value;
            if (email.length < 4) {
                alert('Please enter an email address.');
                return;
            }
            if (password.length < 4) {
                alert('Please enter a password.');
                return;
            }
            // Sign in with email and pass.
            // [START createwithemail]
            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // [START_EXCLUDE]
                if (errorCode == 'auth/weak-password') {
                    alert('The password is too weak.');
                } else {
                    alert(errorMessage);
                }
                console.log(error);
                // [END_EXCLUDE]
            });
            // [END createwithemail]
            var user_details = firebase.database().ref().child("UserInfo/Users");
        // Get input values from each of the form elements
         var displayName = document.getElementById('username').value;
         var contactNumber = document.getElementById('contact').value;
        // Push a new recommendation to the database using those values
        user_details.push({
            "email": email,
            "password":password,
            "username": displayName,
            "contact": contactNumber
        });
        }
        /**
         * initApp handles setting up UI event listeners and registering Firebase auth listeners:
         *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
         *    out, and that is where we update the UI.
         */
        function initApp() {
            // Listening for auth state changes.
            // [START authstatelistener]
            firebase.auth().onAuthStateChanged(function (user) {
                // [START_EXCLUDE silent]
                // document.getElementById('quickstart-verify-email').disabled = true;
                // [END_EXCLUDE]
                if (user) {
                    // User is signed in.
                    var displayName = user.displayName;
                    var email = user.email;
                    var uid = user.uid;
                    //window.location.href = "UserProfilePage.html";
                }
            });
            document.getElementById('signup').addEventListener('click', handleSignUp, false);
        }
        window.onload = function () {
            initApp();
        };