import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { app } from "./firebaseConfig";

const auth = getAuth(app);

// Function to display error messages
function displayError(message) {
    const errorDiv = document.getElementById("error-message"); // Make sure you have an element with this ID in your HTML
    if (errorDiv) {
        errorDiv.textContent = message;
    } else {
        alert(message); // Fallback to alert if no error element is found
    }
}

// Sign-in
const submitButton = document.getElementById("submit");
submitButton.addEventListener("click", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        displayError("Please enter both email and password.");
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Login successful:", user);
        window.location.href = "/explore.html"; // Redirect on success
    } catch (error) {
        let errorMessage = "Login failed.";
        switch (error.code) {
            case "auth/user-not-found":
                errorMessage = "No user found with that email.";
                break;
            case "auth/wrong-password":
                errorMessage = "Incorrect password.";
                break;
            default:
                errorMessage = "An unexpected error occurred. Please try again.";
                console.error("Sign-in error:", error); // Log the error for debugging
        }
        displayError(errorMessage);
    }
});

// Sign-up
const submitButtonReg = document.getElementById("submit-reg");
submitButtonReg.addEventListener("click", async function(event) {
    event.preventDefault();

    const emailReg = document.getElementById("email-reg").value;
    const passwordReg = document.getElementById("password-reg").value;
    const nameReg = document.getElementById("name-reg").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, emailReg, passwordReg);
        const user = userCredential.user;

        await updateProfile(user, {
            displayName: nameReg
        });

        console.log("User profile updated with name:", nameReg);
        window.location.href = "./pages/EXPLORE.html"; // Redirect on success
    } catch (error) {
        let errorMessage = "Sign-up failed.";
        switch (error.code) {
            case "auth/email-already-in-use":
                errorMessage = "That email is already in use.";
                break;
            case "auth/weak-password":
                errorMessage = "The password is too weak (must be at least 6 characters).";
                break;
            default:
                errorMessage = "An unexpected error occurred. Please try again.";
                console.error("Sign-up error:", error); // Log the error for debugging
        }
        displayError(errorMessage);
    }
});
