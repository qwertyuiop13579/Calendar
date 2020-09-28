import Utils from "../../services/utils.js";

let getApp = async (id) => {

    try {
        let ref = firebase.database().ref(`mydb/appointments/${id}`);
        let app;
        let reminders = []
        await ref.once("value").then(function (item) {
            app = item.val();
        })

        ref = firebase.database().ref(`mydb/appointments/${id}/reminders`)
        await ref.once("value").then(function (rems) {
            rems.forEach((rem) => {
                reminders.push(rem.val())
            });
        });
        return { app: app, rems: reminders }
    } catch (err) {
        console.log('Error getting appointment', err.message)
    }
}




let EditApp = {

    render: async () => {
        return /*html*/ `
            <section class="section">
            <div class="container">

            <h1>Edit appointment</h1>
            <p>Please, redact the fields</p>
            <hr>


            <form action="">
                <p>
                    <label for="title"><b>Title</b></label>
                    <input type="text" id="title" name="title" placeholder="Enter title"  required> <br>
                </p>
                <p>
                    <label for="description"><b>Desciption</b></label>
                    <input type="text" id="description" name="description" placeholder="Enter description"  required><br>
                </p>
                <p>
                    <label for="date1"><b>Date</b></label>
                    <input type="date" id="date1" name="date1" required><br>
                </p>
                <p>
                    <label for="time1"><b>Begin</b></label>
                    <input type="time" id="time1" name="time1" required><br>
                </p>
                <p>
                    <label for="time2"><b>End</b></label>
                    <input type="time" id="time2" name="time2" required><br>
                </p>
                <p>
                    <label for="place"><b>Place</b></label>
                    <input type="text" id="place" placeholder="Enter place name"place"><br>
                </p>
                <p>
                    <label for="list1"><b>Remind</b></label>
                    <button type="button" id="addrem" name="addrem"">+ Reminder</button>
                <ul class="listrem" id="listrem" name="listrem">
                </ul>
                </p>
                <p>
                    <label for="color"><b>Color</b></label>
                    <input type="color" id="color" name="color" value="#ff0000"><br>
                </p>
                <div>
                    <button type="button" class="btn1" id="editapp">Edit</button>
                </div>
                
                <div>
                    <button id="cancelbtn" type="button" class="btn2">Cancel</button>
                </div>
                

            </form>

        </div>
            </section>
        `
    }
    // All the code related to DOM interactions and controls go in here.
    // This is a separate call as these can be registered only after the DOM has been painted
    , after_render: async () => {

        let request = Utils.parseRequestURL()
        let res = await getApp(request.id)
        let currapp = res.app
        let rems = res.rems

        document.getElementById("title").value = currapp.title;
        document.getElementById("description").value = currapp.description;
        document.getElementById("date1").value = currapp.date1;
        document.getElementById("time1").value = currapp.time1;
        document.getElementById("time2").value = currapp.time2;
        document.getElementById("place").value = currapp.place;
        document.getElementById("color").value = currapp.color;

        rems.forEach(element => {
            var list = document.getElementById("listrem");
            var li = document.createElement("li");
            var input = document.createElement("input")
            input.setAttribute("type", "time");
            input.setAttribute("id", `idlist${list.childElementCount}`);
            input.setAttribute("value", element)
            li.appendChild(input);
            var btn = document.createElement("button");
            btn.innerText = "D";
            btn.addEventListener('click', () => {
                list.removeChild(li)
            })
            li.appendChild(btn);
            list.appendChild(li);

        });
        


        document.getElementById("addrem").addEventListener("click", () => {
            var list = document.getElementById("listrem");
            var li = document.createElement("li");
            var input = document.createElement("input")
            input.setAttribute("type", "time");
            input.setAttribute("id", `idlist${list.childElementCount}`);
            li.appendChild(input);
            var btn = document.createElement("button");
            btn.innerText = "D";
            btn.addEventListener('click', () => {
                list.removeChild(li)
            })
            li.appendChild(btn);
            list.appendChild(li);
        });

        document.getElementById("cancelbtn").addEventListener("click", () => {
            Utils.navigateTo("/");
        });


        document.getElementById("editapp").addEventListener("click", () => {

            var title = document.getElementById("title").value;
            var description = document.getElementById("description").value;
            var date1 = document.getElementById("date1").value;
            var time1 = document.getElementById("time1").value;
            var time2 = document.getElementById("time2").value;
            var place = document.getElementById("place").value;
            var color = document.getElementById("color").value;

            var rems = [];
            let count = 0;
            while (true) {
                if (document.querySelectorAll(`#idlist${count}`).length != 0) {
                    if (document.querySelector(`#idlist${count}`).value == "") {
                        alert("Fill the fields");
                        count++;
                        rems = [];
                    }
                    else {
                        rems.push(document.querySelector(`#idlist${count}`).value);
                        count++;
                    }
                }
                else break;
            }

            if (title === "" || description === "" || date1 === "" || time1 === "" || time2 === "" || place === "" || color === "") {

                alert("Fill in the fields.");
                return;
            }



            let uid = firebase.auth().currentUser.uid;
            let active = true;

            let app = {
                title: title,
                description: description,
                date1: date1,
                time1: time1,
                time2: time2,
                place: place,
                reminders: rems,
                color: color,
                uid: uid,
                active: active,
            };

            let id = Utils.parseRequestURL().id;
            firebase.database().ref(`mydb/appointments/${id}`).set(app).then((success) => {
                console.log("Edit succeeded.")
                Utils.navigateTo("/");
            }).catch((error) => {
                console.log("Edit failed: " + error.message)
            });
        });
    }
}

export default EditApp;