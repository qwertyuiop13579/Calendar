import Auth from "../../services/auth.js"

let SignIn = {
    render: async () => {
        return /*html*/ `
            <section class="section">
            <div>
                        <div id="signInForm">
                            <h2 class="t-entrance">Sign in</h2>
                            <div class="form-group1">
                                <label for="userEmail">Email<span class="text-danger">*</span></label>
                                <input type="email" class="form-control1" id="userEmail" placeholder="mail@mail.com">
                            </div>
                            <div class="form-group1">
                                <label for="userPassword">Password<span class="text-danger">*</span></label>
                                <input type="password" class="form-control1" id="userPassword" placeholder="Password">
                            </div>
                            <button id = "signinbtn" type="button" class="btn1">Sign in</button>
                        </div>
                    </div>
            </section>
        `
    }
    // All the code related to DOM interactions and controls go in here.
    // This is a separate call as these can be registered only after the DOM has been painted
    , after_render: async () => {
        Auth.SignOut();
        document.getElementById("signinbtn").addEventListener("click", () => {
            let email = document.getElementById("userEmail").value;
            let pass = document.getElementById("userPassword").value;
            if (email == '' | pass == '') {
                alert(`The fields cannot be empty.`)
            }
            else {
                Auth.SignIn(email, pass);
            }
        })
    }
}

export default SignIn;