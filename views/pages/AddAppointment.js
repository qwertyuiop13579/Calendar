import Utils from "../../services/Utils.js";

let AddApp = {

    render: async () => {
        return /*html*/ `
            <section class="section">
            <div class="container">

            <h1>Add appointment</h1>
            <p>Please, enter the fields</p>
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
                    <button type="button" class="btn1" id="addapp">Add</button>
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


        document.getElementById("addapp").addEventListener("click", () => {

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

            if (title === "" || description === "" || date1 === "" || time1 === "" || time2 === "" || place === "" || color === ""||time1>time2) {
                
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

            let id = `f${(+new Date).toString(16)}`;
            firebase.database().ref(`mydb/appointments/${id}`).set(app).then((success) => {
                console.log("Add succeeded.")
                Utils.navigateTo("/");
            }).catch((error) => {
                console.log("Add failed: " + error.message)
            });
        });
    }
}

export default AddApp;