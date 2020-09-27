import Utils from './../../services/Utils.js'
import Functions from './../../services/data.js'


let currentdate = new Date();

function formattedDate(d = new Date) {
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = String(d.getFullYear());
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return `${year}/${month}/${day}`;
}


async function ChangeDate(elem, mess) {

    if (document.querySelectorAll('td.active').length != 0) {
        document.querySelector('td.active').classList.remove("active");
    }
    if (elem != null) {
        if (!elem.classList.contains("today") & elem.classList.contains("days")) elem.classList.add("active");
    }


    let apps = [];
    let keys = [];
    let ref = firebase.database().ref(`mydb/appointments`);

    let uid;
    let date;

    date = new Date(`${mess}`);
    currentdate = date;
    document.querySelector('#listhead').innerText = `Appointments on ${Utils.formattedDate(date)}`;

    await ref.once("value").then(function (arr) {
        uid = firebase.auth().currentUser.uid;
        arr.forEach(function (item) {
            let app = item.val();

            if (uid == app.uid && Utils.formattedDate(date) == Utils.formattedDate(new Date(app.date1))) {
                apps.push(app);
                keys.push(item.key);
            }
            else {

            }
        });
    });

    var count = 0;
    document.querySelector('#listapp').innerHTML = "";


    if (apps.length != 0) {
        apps.forEach(async (element) => {

            var li = document.createElement("li");
            var input = document.createElement("input");
            input.setAttribute("type", "checkbox");
            input.setAttribute("class", "hide");
            input.setAttribute(`id`, `hd${count}`);
            var label = document.createElement("label");
            label.setAttribute("for", `hd${count}`);
            label.setAttribute("style", `color:${element.color}`);
            label.innerText = element.title;
            var div = document.createElement("div");
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
            //button.setAttribute("onClick", `ReplaceToEditApp('${keys[apps.indexOf(element)]}')`);
            button.addEventListener('click', () => {
                Utils.navigateTo(`#/editappointment/${keys[apps.indexOf(element)]}`)
            })

            div.appendChild(button);



            button = document.createElement("button");
            button.setAttribute("class", "b-little");
            button.innerText = "Delete";
            //button.setAttribute("onClick", `DeleteApp('${keys[apps.indexOf(element)]}')`);
            button.addEventListener('click', async () => {
                let ref = firebase.database().ref(`mydb/appointments/${keys[apps.indexOf(element)]}`);
                ref.remove().then(function () {
                    console.log("Remove succeeded.")
                })
                    .catch(function (error) {
                        console.log("Remove failed: " + error.message)
                    });
                ChangeDate(null, currentdate);
                ColorTd()
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
            //checkbox.setAttribute("onClick", `ChangeStateApp('${keys[apps.indexOf(element)]}')`);
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

function calendar(id, year, month) {
    var Dlast = new Date(year, month + 1, 0).getDate(),
        D = new Date(year, month, Dlast),
        DNlast = new Date(D.getFullYear(), D.getMonth(), Dlast).getDay(),
        DNfirst = new Date(D.getFullYear(), D.getMonth(), 1).getDay(),
        //month = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
        month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


    var calendar1 = document.createElement("tbody");
    var tr1 = document.createElement("tr");
    var td = document.createElement("td");
    if (DNfirst != 0) {
        for (var i = 1; i < DNfirst; i++) {
            td = document.createElement("td");
            tr1.appendChild(td);
        }
    }
    else {
        for (var i = 0; i < 6; i++) {
            td = document.createElement("td");
            tr1.appendChild(td);
        }
    }

    for (var i = 1; i <= Dlast; i++) {
        let CurrentDateString = D.getFullYear() + "/" + ('0' + (D.getMonth() + 1)).slice(-2) + "/" + ('0' + `${i}`).slice(-2);

        if (i == new Date().getDate() && D.getFullYear() == new Date().getFullYear() && D.getMonth() == new Date().getMonth()) {
            td = document.createElement("td");
            td.setAttribute("class", "today days");

            td.innerText = i;
            tr1.appendChild(td);
        } else {
            td = document.createElement("td");
            td.setAttribute("class", "days");
            td.innerText = i;
            tr1.appendChild(td);
        }
        if (new Date(D.getFullYear(), D.getMonth(), i).getDay() == 0) {
            calendar1.appendChild(tr1);
            tr1 = document.createElement("tr");
        }
    }
    for (var i = DNlast; i < 7; i++) {
        let elem = document.createElement("td");
        elem.innerHTML += '<td>&nbsp;';
        //td = document.createElement("td");
        //td.textContent = ' ';
        //tr1.innerHTML+="&nbsp;"

        tr1.appendChild(elem);
    }


    calendar1.appendChild(tr1);
    document.getElementById('calendarbody').innerHTML = " ";
    document.getElementById('calendarbody').innerHTML = calendar1.innerHTML;
    document.querySelector('#' + id + ' thead td:nth-child(2)').innerHTML = month[D.getMonth()] + ' ' + D.getFullYear();
    document.querySelector('#' + id + ' thead td:nth-child(2)').dataset.month = D.getMonth();
    document.querySelector('#' + id + ' thead td:nth-child(2)').dataset.year = D.getFullYear();
    if (document.querySelectorAll('.calendarbody tr').length < 6) {  // чтобы при перелистывании месяцев не "подпрыгивала" вся страница, добавляется ряд пустых клеток. Итог: всегда 6 строк для цифр
        document.getElementById('calendarbody').innerHTML += '<tr> <td> <td> <td> <td> <td> <td> <td> </tr>';
    }
}



async function ColorTd() {

    document.querySelectorAll('#calendarbody td.days').forEach(async (element) => {

        let day = element.innerText;
        let month = parseFloat(document.querySelector('#calendar thead td:nth-child(2)').dataset.month) + 1;
        let year = document.querySelector('#calendar thead td:nth-child(2)').dataset.year;
        let DateString = year + "/" + month + "/" + day;
        let res = await Functions.getAppsbyDate(new Date(DateString))
        let apps = res.arr1;
        let keys = res.arr2;

        if (apps.length != 0) {
            let colors = []
            let colorstr = ""
            apps.forEach((app) => {
                colors.push(app.color)
                colorstr += app.color
                colorstr += ","
            })
            colorstr = colorstr.slice(0, -1)

            if (apps.length == 1) {
                element.setAttribute('style', `background: ${colorstr};`);
            }
            else element.setAttribute('style', `background: linear-gradient(${colorstr});`);
            //element.style.background =   lineargradient('#e66465', '#9198e5');

        }

    });

}

function AddClickListeners() {
    document.querySelectorAll('#calendarbody td.days').forEach(e => e.addEventListener("click", async function (event) {
        let day = this.innerText;
        let month = parseFloat(document.querySelector('#calendar thead td:nth-child(2)').dataset.month) + 1;
        let year = document.querySelector('#calendar thead td:nth-child(2)').dataset.year;
        let CurrentDateString = year + "/" + month + "/" + day;
        await ChangeDate(this, `${CurrentDateString}`);
    }));
}



async function SetReminders(date1) {

    let date = new Date(`${date1}`);
    let res = await Functions.getAppsbyDate(date)
    let apps = res.arr1;
    let keys = res.arr2;


    if (apps.length != 0) {
        apps.forEach(async (elem) => {
            let idapp = keys[apps.indexOf(elem)]
            //alert(idapp)
            let ref = firebase.database().ref(`mydb/appointments/${idapp}/reminders`)
            await ref.once("value").then(function (rems) {
                rems.forEach((rem) => {
                    let remdate = new Date();
                    remdate.setHours(rem.val().slice(0, 2))
                    remdate.setMinutes(rem.val().slice(3, 5))
                    remdate.setSeconds(0)
                    let diff = new Date() - remdate
                    if (diff < 0) {                        
                        setTimeout(function () {
                            alert("You have an appointment " + elem.title + " at " + elem.time1 + " - " + elem.time2)
                        }, -diff)
                    }

                })

            });
        })
    }
}





let Home = {
    render: async () => {
        let view =  /*html*/`
           <section class="section">
           <div>
           <div class="contcalend">
             <table id="calendar" cellspacing="0" cellpadding="1">
               <thead>
                 <tr>
                   <td><b>‹</b></td>
                   <td colspan="5">
                   <td><b>›</b></td>
                 </tr>
                 <tr>
                   <td>Mo</td>
                   <td>Tu</td>
                   <td>We</td>
                   <td>Th</td>
                   <td>Fr</td>
                   <td>Sa</td>
                   <td>Su</td>
                 </tr>
               </thead>
               <tbody id="calendarbody" class="calendarbody">
     
               </tbody>
             </table>
           </div>
         </div>

         <div>
         <h2 id="listhead">Appointments</h2>
         <ul class="listapp" id="listapp">
   
         </ul>
       </div>
   
       <div>
         <button id="addappbtn" type="button" class="btn1">Add</button>
       </div>

           </section>
       `
        return view
    }
    , after_render: async () => {


        document.getElementById("addappbtn").addEventListener("click", () => {
            Utils.navigateTo("#/addappointment");
        });

        calendar("calendar", new Date().getFullYear(), new Date().getMonth());
        // переключатель минус месяц
        document.querySelector('#calendar thead tr:nth-child(1) td:nth-child(1)').onclick = function () {
            calendar("calendar", document.querySelector('#calendar thead td:nth-child(2)').dataset.year,
                parseFloat(document.querySelector('#calendar thead td:nth-child(2)').dataset.month) - 1);
            AddClickListeners()
            ColorTd()
        }
        // переключатель плюс месяц
        document.querySelector('#calendar thead tr:nth-child(1) td:nth-child(3)').onclick = function () {
            calendar("calendar", document.querySelector('#calendar thead td:nth-child(2)').dataset.year,
                parseFloat(document.querySelector('#calendar thead td:nth-child(2)').dataset.month) + 1);
            AddClickListeners()
            ColorTd()
        }

        AddClickListeners()
        ColorTd()



        var CurrentDateString = formattedDate(new Date());
        //var CurrentDateString = date.getFullYear() + "-" + ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + `${date.getDate()}`).slice(-2);
        ChangeDate(null, `${CurrentDateString}`);



        SetReminders(CurrentDateString)




    }

}

export default Home;
