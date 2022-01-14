const firebaseConfig = {
    apiKey: "AIzaSyDXKDN-jFpopNhlKoe512xVWWGOjnV_RM0",
    authDomain: "ntut-web-905c4.firebaseapp.com",
    projectId: "ntut-web-905c4",
    storageBucket: "ntut-web-905c4.appspot.com",
    messagingSenderId: "613939349652",
    appId: "1:613939349652:web:044ba4ff76c153051dcc81",
    measurementId: "${config.measurementId}"
};

async function changepassword(ob){
    var id = ob.id;
    console.log(id)
    var password = document.getElementById("pass-" + id).value;
    console.log(password)
    if(password == ""){
        alert("No empty password");
        return;
    }
    var username = document.getElementById("user-" + id).innerHTML;
    await fetch('https://mail.potatoserver.net/api/setpasswd',{method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({user: username, pass: password})})
    .then(() => {
        alert("success");
        init()
    })
    console.log(password);
}

async function deleteUser(ob){
    var id = ob.id;
    var password = document.getElementById("pass-" + id).value;
    var username = document.getElementById("user-" + id).innerHTML;
    await fetch('https://mail.potatoserver.net/api/delUser',{method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({user: username, pass: password})})
    .then(() => {
        alert("success");
        init()
    })
}

async function AddUser(ob){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    await fetch('https://mail.potatoserver.net/api/addUser',{method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({user: username, pass: password})})
    .then(() => {
        alert("success");
        init()
    })
}

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
async function init(){
    document.getElementById("tb").innerHTML = "";
await    db
        .collection("mail_user")
        .get()
        .then(docList => {
            docList.forEach(doc => {
                const user = doc.data();
                var col = `<tr>
                                <th scope="row">#</th>
                                <td id="${"user-" + doc.id}">${user.user}</td>
                                <td><input autocomplete="off" type="password" id="${"pass-" + doc.id}"></td>`
                col += `<td><button id="${doc.id}" class="btn btn-primary" onclick="changepassword(this)">Set</button>`
                if(user.user != 'admin'){col += `<button id="${doc.id}" class="btn btn-danger" onclick="deleteUser(this)">Delete</button></td>`}
                else{col += `</td>`}
                col += `</tr>`
                $("#tb").append(col)
            });
        })
    var mod = `<tr>
                    <th scope="row">#</th>
                    <td><input autocomplete="off" type="text" id="username"></td>
                    <td><input autocomplete="off" type="password" id="password"></td>
                    <td><button class="btn btn-primary" onclick="AddUser(this)">Add</button></td>
                </tr>`
    $("#tb").append(mod)
}

init()