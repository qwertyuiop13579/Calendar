import Auth from "../../services/auth.js"

let Profile = {
    render: async () => {
        return /*html*/ `
            <section class="section">
            <div class="form1">
                        <div id="profileSection">
                            <div class="t4">
                                <span class="h3" id="userPfFullName"></span>
                                <span class="h3" id="userPfSurname"></span>
                            </div>     
                            <div class="t5">
                                <p id="userPfBio" class="p1"></p>
                            </div>
                            <div class="t5">
                                <button type="button" id="showeditbtn" class="btn1">Edit profile</button>
                                
                            </div>
                        </div>
                        <div id="editProfileForm" style="display: none;">
                            <h2 class="h2">Edit profile</h2>
                            <div class="form-group1">
                                <label for="userFullName">Name<span class="text-danger">*</span></label>
                                <input type="text" class="form-control1" id="userFullName" placeholder="Name">
                            </div>
                            <div class="form-group1">
                                <label for="userSurname">Surname<span class="text-danger">*</span></label>
                                <input type="text" class="form-control1" id="userSurname" 
                                    placeholder="Surname">
                               
                            </div>
                            <div class="form-group1">
                                <label for="userBio">About<span class="text-danger">*</span></label>
                                <textarea class="form-control1" id="userBio" rows="4"></textarea>
                            </div>
                            
                            <button id="savebtn" type="button" class="btn1">Save</button>
                            <button id="cancelbtn" type="button" class="btn1">Cancel</button>
                        </div>
                    </div>
            </section>
        `
    }
    // All the code related to DOM interactions and controls go in here.
    // This is a separate call as these can be registered only after the DOM has been painted
    , after_render: async () => {


        firebase.auth().onAuthStateChanged(async function (user) {
            if (user) {
                let uid = user.uid

                let firebaseRefKey = firebase.database().ref("mydb/users").child(uid);
                await firebaseRefKey.on('value', (dataSnapShot) => {
                    document.getElementById("userPfFullName").innerHTML = dataSnapShot.val().userName;
                    document.getElementById("userPfSurname").innerHTML = dataSnapShot.val().userSurname;
                    document.getElementById("userPfBio").innerHTML = dataSnapShot.val().userBio;
                })
            } else {
                // No user is signed in.
            }
        });

        document.getElementById("showeditbtn").addEventListener("click", () => {
            document.getElementById("profileSection").style.display = "none";
            document.getElementById("editProfileForm").style.display = "block";
        });
        document.getElementById("cancelbtn").addEventListener("click", () => {
            document.getElementById("profileSection").style.display = "block";
            document.getElementById("editProfileForm").style.display = "none";
        });

        document.getElementById("savebtn").addEventListener("click", () => {
            let userFullName = document.getElementById("userFullName").value
            let userSurname = document.getElementById("userSurname").value
            let userBio = document.getElementById("userBio").value
            let uid = Auth.getCurrentUid();
            let firebaseRef = firebase.database().ref("mydb/users");
            let userData = {
                userFullName: userFullName,
                userSurname: userSurname,
                userBio: userBio,
            }
            firebaseRef.child(uid).set(userData).catch((error) => { window.alert(`${error.message}`) });;
            document.getElementById("profileSection").style.display = "block";
            document.getElementById("editProfileForm").style.display = "none";
            document.getElementById("lab1").innerText = userFullName;

            document.getElementById("userPfFullName").innerHTML = userFullName
            document.getElementById("userPfSurname").innerHTML = userSurname
            document.getElementById("userPfBio").innerHTML = userBio

        });

        /*
                let uid = Auth.getCurrentUid();
        
                let firebaseRefKey = firebase.database().ref("mydb/users").child(uid);
                await firebaseRefKey.on('value', (dataSnapShot) => {
                    document.getElementById("userPfFullName").innerHTML = dataSnapShot.val().userFullName;
                    document.getElementById("userPfSurname").innerHTML = dataSnapShot.val().userSurname;
                    document.getElementById("userPfBio").innerHTML = dataSnapShot.val().userBio;
                })
        
        */
    }
}

export default Profile;