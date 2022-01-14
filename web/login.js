

const loginBtn = document.getElementById("LoginBtn");
const inpu = document.getElementById("pass");

inpu.addEventListener('keydown',(e) => {
    if(e.key == "Enter"){
        var username = document.getElementById('user').value;
    var password = document.getElementById('pass').value;
    if(username == ""){
        if(document.getElementById('error_box').innerHTML == ''){
            document.getElementById('user').style.borderBottomColor = "red";
            document.getElementById('error_box').innerHTML += "❗請書入使用者名稱";
        }
    }
    if(password == "") {
        if(document.getElementById('error_box1').innerHTML == ''){
            document.getElementById('pass').style.borderBottomColor = "red";
            document.getElementById('error_box1').innerHTML += "❗請書入使用者密碼";
        }
    }
    if(username == "" || password == "") return;
    fetch('https://mail.potatoserver.net/api/auth',{method: 'POST',headers: {'Content-Type': 'application/json'},body: JSON.stringify({user: username,pass: password})}).then((response) => response.json())
    .then(user => {
        console.log(user)
        if(user.success){
            document.cookie = "token=" + user.token;
            window.location.replace("https://mail.potatoserver.net/mailbox.html");
        }else{
            swal('登入失敗','帳號或密碼錯誤');
        }
    })
    }
})

loginBtn.addEventListener('click',async function (event) {
    console.log(document.cookie)
    var username = document.getElementById('user').value;
    var password = document.getElementById('pass').value;
    if(username == ""){
        if(document.getElementById('error_box').innerHTML == ''){
            document.getElementById('user').style.borderBottomColor = "red";
            document.getElementById('error_box').innerHTML += "❗請書入使用者名稱";
        }
    }
    if(password == "") {
        if(document.getElementById('error_box1').innerHTML == ''){
            document.getElementById('pass').style.borderBottomColor = "red";
            document.getElementById('error_box1').innerHTML += "❗請書入使用者密碼";
        }
    }
    if(username == "" || password == "") return;
    fetch('https://mail.potatoserver.net/api/auth',{method: 'POST',headers: {'Content-Type': 'application/json'},body: JSON.stringify({user: username,pass: password})}).then((response) => response.json())
    .then(user => {
        console.log(user)
        if(user.success){
            document.cookie = "token=" + user.token;
            window.location.replace("https://mail.potatoserver.net/mailbox.html");
        }else{
            swal('登入失敗','帳號或密碼錯誤');
        }
    })
});