import Utils from "./utils.js";

const Functions = {


    getApp: async (id) => {
        await ref.once("value").then(function (elem) {
            let app = elem.val();
        })
        return app;
    },

    deleteApp: (id) => {
        let ref = firebase.database().ref(`mydb/appointments/${id}`);
        ref.remove().then(function () {
            console.log("Remove succeeded.")
        })
            .catch(function (error) {
                console.log("Remove failed: " + error.message)
            });
    },


    getAppsbyDate: async (date)=> {
        let apps= []
        let keys= [] 

        let ref = firebase.database().ref(`mydb/appointments`);
        await ref.once("value").then(function (arr) {
            let uid = firebase.auth().currentUser.uid;
            arr.forEach(function (item) {
                let app = item.val();
                if (uid == app.uid && Utils.formattedDate(date) == Utils.formattedDate(new Date(app.date1))) {
                    
                    apps.push(app);
                    keys.push(item.key);
                }
            });
        });
        return {arr1:apps,arr2:keys};
    },

}



export default Functions