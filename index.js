function dispError(text) {
    // Errors go here
    d = document.getElementById("errorDisplay");
    d.style.display = "block";
    d.innerHTML = text;

    return false;
}

function hideError() {
    // Errors go here
    d = document.getElementById("errorDisplay");
    d.style.display = "none";
    d.innerHTML = "";
}

function isValidUsername(username) {

    let valid = true;

    // The username cannot be blank.
    if ((username === undefined) || (username === null) || (username.length === 0))
        valid = dispError("The username cannot be blank.");

    // The username must be at least four characters long.
    else if (username.length < 4)
        valid = dispError(`The username must be at least four characters long.`);

    // The username cannot contain any special characters or whitespace.
    else if (username.match(/[^\w\s]/g))
        valid = dispError("The username cannot contain any special characters or whitespace.");

    // The username must contain at least two unique characters.
    else {
        const listOfChars = new Set(username);
        if (listOfChars.size < 2)
            valid = dispError("Username must contain at least two unique characters.");
    }

    return (valid);
}

function isValidEmail(email) {

    let valid = true;
    let emailDiv = document.getElementById("email");
    let regex = /^[\w-]+(\.[\w-]+)*@([\w-]+.)+[\w-]{2,4}$/;

    // The email cannot be blank.
    if ((email === undefined) || (email === null) || (email.length === 0))
        valid = dispError("The email cannot be blank.");

    // The email must be a valid email addres.
    else if (!email.match(regex))
        valid = dispError("The email must be a valid email address.");
    else if (!emailDiv.checkValidity())
        valid = dispError(email.validationMessage);

    // The email must not come from example.com
    else if (email.toLowerCase().includes("example.com"))
        valid = dispError("The email must not come from example.com");

    return (valid);
}

function hasUppercaseAndLowercase(text) {
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;

    return uppercaseRegex.test(text) && lowercaseRegex.test(text);
}

function hasNumber(password) {
    const numberRegex = /\d/;
    return numberRegex.test(password);
}

function hasSpecialCharacter(password) {
    const specialCharacterRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?]/;
    return specialCharacterRegex.test(password);
}

function doesNotContainPassword(password) {
    const passwordRegex = /password/i;
    return !passwordRegex.test(password);
}

function doesNotIncludeUsername(password, username) {
    const usernameRegex = new RegExp(username, "i");
    return !usernameRegex.test(password);
}

function userInLocalStorage(username) {
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

    // Convert username to lowercase
    username = username.toLowerCase();

    // Does it match the local storage?
    if (existingUsers.includes(username))
        return true;
    else
        return dispError("Username doesn't exist.");
}

function saveUserCredentials(username, password) {
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

    // Convert username to lowercase
    username = username.toLowerCase();

    // Does it match the local storage?
    if (existingUsers.includes(username)) {
        dispError("Username already exists.");
        return false;
    } else {
        // Add username to the list we got from local storage
        existingUsers.push(username);
        localStorage.setItem('users', JSON.stringify(existingUsers));

        // Save username/password
        localStorage.setItem('password_' + username, password);
    }
    return true;
}

function isValidPassword(username, password1, password2) {
    let valid = true;

    // The password can't be blank
    if ((password1 === undefined) || (password1 === null) || (password1.length === 0) ||
        (password2 === undefined) || (password2 === null) || (password2.length === 0))
        valid = dispError("The password cannot be blank.");

    // Passwords must be at least 12 characters long.
    else if ((password1.length < 12) || (password2.length < 12))
        valid = dispError("Passwords must be at least 12 characters long.");

    // Passwords must have at least one uppercase and one lowercase letter.
    else if (!(hasUppercaseAndLowercase(password1) && hasUppercaseAndLowercase(password2)))
        valid = dispError("Passwords must have at least one uppercase and one lowercase letter");

    // Passwords must contain at least one number.
    else if (!(hasNumber(password1) && hasNumber(password2)))
        valid = dispError("Passwords must contain at least one number.");

    // Passwords must contain at least one special character.
    else if (!(hasSpecialCharacter(password1) && hasSpecialCharacter(password2)))
        valid = dispError("Passwords must contain at least one special character.");

    // Passwords can't contain the word password
    else if (!(doesNotContainPassword(password1) && doesNotContainPassword(password2)))
        valid = dispError("Passwords can't contain the word password.");

    // Passwords cannot contain the username.
    else if (!(doesNotIncludeUsername(password1, username) && (doesNotIncludeUsername(password2, username))))
        valid = dispError("Passwords cannot contain the username");

    // Both passwords must match.
    else if (password1 !== password2)
        valid = dispError("Both passwords must match.")

    return (valid);
}

function validateRegistrationForm() {

    let valid=false;
    let username = "";
    let email = "";
    let password1 = "";
    let password2 = "";
    hideError();


    debugger;

    let usernameDiv  = document.getElementById("username");
    let emailDiv     = document.getElementById("email");
    let password1Div = document.getElementById("password");
    let password2Div = document.getElementById("passwordCheck");

    username = document.getElementById("username").value;
    email = document.getElementById("email").value;
    password1 = document.getElementById("password").value;
    password2 = document.getElementById("passwordCheck").value;

    // Validate the form fields again
    // if (!usernameDiv.checkValidity()) {
    //   d.innerHTML = username.validationMessage;
    // } else if (!emailDiv.checkValidity()) {
    //   document.getElementById("errorDisplay").innerHTML = email.validationMessage;
    // } else if (!password1.checkValidity()) {
    //   document.getElementById("errorDisplay").innerHTML =
    //     password1.validationMessage;
    // } else if (password1 !== password2) {
    //   document.getElementById("errorDisplay").innerHTML = `Passwords must match`;
    // }

    // Username validation
    if (!isValidUsername(username))
        return;

    // Email validation
    if (!isValidEmail(email))
        return;

    // Password validation
    if (!isValidPassword(username, password1, password2))
        return;

    // Checkbox is checked
    const termsCheckbox = document.getElementById("terms");
    if (!termsCheckbox.checked === true) {
        dispError(`Terms and conditions are not checked.`);
        return;
    }

    //=================================================
    // Form fields are validated!
    //=================================================

    // Save user credentials
    if (!saveUserCredentials(username, password1))
        return;

    // Reset the form
    document.getElementById("registration").reset();
    window.alert("Registration is successful!");
}

function validateLoginForm() {

    function validateLogin(username, password) {
        const storedPassword = localStorage.getItem('password_' + username.toLowerCase());
        if (!storedPassword) {
            return dispError("Username not found in local storage");
        }

        // Make sure passwords match
        if (storedPassword !== password)
            return dispError ("Password entered doesn't match password in local storage");

        // We matched!
        return true;
    }


    let usernameDiv  = document.getElementById("loginUsername");
    let passwordDiv = document.getElementById("loginPassword");
    let username = document.getElementById("loginUsername").value;
    let password1 = document.getElementById("loginPassword").value;

    // The username cannot be blank.
    // We use the full user validation instead of just checking for blank
    if (!isValidUsername(username))
        return;

    // The username must exist (within localStorage)
    if (!userInLocalStorage(username))
        return;

    // Validate password
    if (!isValidPassword(password))
        return;

    // Validate that the username and password match!
    if (!validateLogin(username, password))
        return;

    // Login successful! Reset the form
    document.getElementById("login").reset();

    // Checkbox is checked
    const keepLoggedInCheckbox = document.getElementById("persist");
    if (!keepLoggedInCheckbox.checked === true) {
        window.alert("Login successful!  Staying logged in for the future.");
        return;
    } else {
        // Regular login
        window.alert("Login successful!");
        return;
    }
}

function registrationEventHandler(event) {
    event.preventDefault();
    validateRegistrationForm();
}

function loginEventHandler(event) {
    event.preventDefault();
    validateLoginForm();
}

// Register
const registrationForm = document.getElementById("registration");
const loginForm = document.getElementById("login");

console.log(registrationForm);
registrationForm.addEventListener("submit", registrationEventHandler);

console.log(loginForm);
loginForm.addEventListener("submit", loginEventHandler);

