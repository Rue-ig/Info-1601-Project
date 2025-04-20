import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { firebaseApp } from "./firebaseConfig"; // Import the initialized Firebase app

// Use the imported Firebase app to get the auth instance
const auth = getAuth(firebaseApp);

//sign in
const submitButton = document.getElementById("submit");
submitButton.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default form submission

    //sign in inputs and buttons
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email && password) {
        console.log("Email:", email);
        console.log("Password:", password);
        alert("Login successful!");
    } else {
        alert("Please enter both email and password.");
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert("Login successful!");
            // Redirect to the explore page
            window.location.href = "/explore.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        }); 
});

//sign up
const submitButtonReg = document.getElementById("submit-reg");
submitButtonReg.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default form submission

    //sign up inputs and buttons
    const emailReg = document.getElementById("email-reg").value;
    const passwordReg = document.getElementById("password-reg").value;
    const nameReg = document.getElementById("name-reg").value;

    createUserWithEmailAndPassword(auth, emailReg, passwordReg)
        .then((userCredential) => {
            const user = userCredential.user;

            // Update the user's profile with their name
            updateProfile(user, {
                displayName: nameReg
            }).then(() => {
                console.log("User profile updated with name:", nameReg);
                alert("Sign-up successful!");
            }).catch((error) => {
                console.error("Error updating profile:", error.message);
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error during sign-up:", errorMessage);
        });
});