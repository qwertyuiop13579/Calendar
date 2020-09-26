import Utils from "./Utils.js";

let Auth = {

    SignIn: (email, password) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(function (result) {
            Utils.navigateTo("/");
        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(error.message);
            window.alert(`${errorMessage}`);
        });
    },

    signUp: (name, surname, email, password) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then((result) => {
            var user = result.user;
            var uid;
            if (user != null) {
                uid = user.uid;
            }
            var firebaseRef = firebase.database().ref("mydb/users");
            var userData = {
                userName: name,
                userSurname: surname,
                userEmail: email,
                userPassword: password,
                userBio: "",
            }
            firebaseRef.child(uid).set(userData, function (error) {
                if (error) {
                    console.log(error.message);
                } else {
                    Utils.navigateTo("/");
                }
            });
        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(error.message);
            window.alert(`${errorMessage}`);

        });
    },

    SignOut: () => {
        firebase.auth().signOut().then(function () {
            Utils.navigateTo("/");
        }).catch(function (error) {
            // An error happened.
            let errorMessage = error.message;
            window.alert(`${errorMessage}`);
            console.log(error.message);
        });
    },

    getCurrentUid: () => {
        return firebase.auth().currentUser.uid;
    }
}


export default Auth