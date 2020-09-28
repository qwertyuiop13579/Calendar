import Auth from "../../services/auth.js"

let Register = {
    render: async () => {
        return /*html*/ `
            <section class="section">
            <div id="signUpForm">
                            <h2 class="t-entrance">Sign up</h2>
                            <div class="form-group1">
                                <label for="userFullName">Name<span class="text-danger">*</span></label>
                                <input  class="form-control1" id="userFullName" placeholder="Name">
                            </div>
                            <div class="form-group1">
                                <label for="userSurname">Surname<span class="text-danger">*</span></label>
                                <input  class="form-control1" id="userSurname"  placeholder="Surname">
                            </div>
                            <div class="form-group1">
                                <label for="userEmail">Email<span class="text-danger">*</span></label>
                                <input type="email" class="form-control1" id="userEmail" placeholder="mail@mail.com">
                            </div>
                            <div class="form-group1">
                                <label for="userPassword">Password<span class="text-danger">*</span></label>
                                <input type="password" class="form-control1" id="userPassword" placeholder="Password">
                            </div>
                            <div class="form-group1">
                                <label for="rptuserPassword">Repeat password<span class="text-danger">*</span></label>
                                <input type="password" class="form-control1" id="rptuserPassword" placeholder="Repeat password">
                            </div>
                            <div>
                                <button id="signupbtn" class="btn1">Sign up</button>
                            </div>
                             
                        </div>
            </section>
        `
    }
    // All the code related to DOM interactions and controls go in here.
    // This is a separate call as these can be registered only after the DOM has been painted
    , after_render: async () => {
        document.getElementById("signupbtn").addEventListener("click", () => {
            let name = document.getElementById("userFullName").value;
            let surname = document.getElementById("userSurname").value;
            let email = document.getElementById("userEmail").value;
            let pass = document.getElementById("userPassword").value;
            let repeatPass = document.getElementById("rptuserPassword").value;

            if (pass != repeatPass) {
                alert(`The passwords don't match.`)
            } else if (email == '' | pass == '' | name == '' | surname == '') {
                alert(`The fields cannot be empty.`)
            }
            else {
                Auth.signUp(name,surname,email,pass);

                
            }
        });
    }
}

export default Register;