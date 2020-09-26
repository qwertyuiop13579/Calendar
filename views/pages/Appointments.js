import Utils from "../../services/Utils.js";

function formattedDate(d = new Date) {
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = String(d.getFullYear());
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return `${year}/${month}/${day}`;
}


async function ShowAllApps() {

    let apps = [];
    let keys = [];
    let ref = firebase.database().ref(`mydb/appointments`);

    let uid;

    await ref.once("value").then(function (arr) {
        uid = firebase.auth().currentUser.uid;
        arr.forEach(function (item) {
            let app = item.val();

            if (uid == app.uid) {
                apps.push(app);
                keys.push(item.key);
            }
        });
    });

    var count = 0;
    document.querySelector('#listapp').innerHTML = "";


    if (apps.length != 0) {
        apps.forEach((element) => {

            var li = document.createElement("li");
            var input = document.createElement("input");
            input.setAttribute("type", "checkbox");
            input.setAttribute("class", "hide");
            input.setAttribute(`id`, `hd${count}`);
            var label = document.createElement("label");
            label.setAttribute("for", `hd${count}`);
            label.innerText = element.title;
            var div = document.createElement("div");
            label.setAttribute("for", `hd${count}`);
            var p = document.createElement("p");
            p.innerText = element.description;
            div.appendChild(p);
            var p = document.createElement("p");
            p.innerText = formattedDate(new Date(element.date1)) + "  " + element.time1 + " - " + element.time2;
            div.appendChild(p);
            var p = document.createElement("p");
            p.innerText = "Place: " + element.place;
            div.appendChild(p);


            let button = document.createElement("button");
            button.setAttribute("class", "b-little");
            button.innerText = "Edit";
            button.addEventListener('click',()=>{
                Utils.navigateTo(`#/editappointment/${keys[apps.indexOf(element)]}`)
            })          
            div.appendChild(button);



            button = document.createElement("button");
            button.setAttribute("class", "b-little");
            button.innerText = "Delete";
            button.addEventListener('click',async ()=>{
                let ref = firebase.database().ref(`mydb/appointments/${keys[apps.indexOf(element)]}`);
                ref.remove().then(function () {
                  console.log("Remove succeeded.")
                })
                  .catch(function (error) {
                    console.log("Remove failed: " + error.message)
                  });
                ChangeDate(null, currentdate);
            })
            div.appendChild(button);


            let div1 = document.createElement("div");
            let label1 = document.createElement("label");
            label1.setAttribute("for", "active");
            label1.innerText = "Status";
            let checkbox = document.createElement("input");
            checkbox.setAttribute("type", "checkbox");
            checkbox.setAttribute("class", "check1");
            checkbox.setAttribute("id", "active");
            if (element.active) checkbox.removeAttribute("checked");
            else checkbox.setAttribute("checked", "checked");
            checkbox.addEventListener('click', async () => {

                let ref = firebase.database().ref(`mydb/appointments/${keys[apps.indexOf(element)]}/active`);
                let state = false;
                await ref.once("value").then(function (item) {
                    state = item.val();
                    state = state ? false : true;
                })

                await ref.set(state).then(function () {
                    console.log("Change state succeeded.")
                })
                    .catch(function (error) {
                        console.log("Change failed: " + error.message)
                    });
            })

            div1.appendChild(checkbox);
            div1.appendChild(label1);
            div.appendChild(div1);

            li.appendChild(input);
            li.appendChild(label);
            li.appendChild(div);

            count++;
            document.querySelector('#listapp').appendChild(li);

        })
    }
    else {
        var li = document.createElement("li");
        li.innerText = "No appointments";
        document.querySelector('#listapp').appendChild(li);
    }
}




let AllApp = {

    render: async () => {
        return /*html*/ `
            <section class="section">
            <div class="container">

            <div>
            <h2 id="h2list">Appointments</h2>
            <ul class="listapp" id="listapp">

            </ul>
        </div>
                

            </form>

        </div>
            </section>
        `
    }
    // All the code related to DOM interactions and controls go in here.
    // This is a separate call as these can be registered only after the DOM has been painted
    , after_render: async () => {


        ShowAllApps()


    }
}

export default AllApp;