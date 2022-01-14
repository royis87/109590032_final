/* <a href="#" class="list-group-item list-group-item-action py-3 lh-tight" id="0" aria-current="true">
    <div class="d-flex w-100 align-items-center justify-content-between">
    <strong class="mb-1">List group item heading</strong>
    <small>Wed</small>
    </div>
    <div class="col-10 mb-1 small">Some placeholder content in a paragraph below the heading and date.</div>
</a> */
function method(butt){
    var id = butt.id;
    if(id == 'LogOutBtn'){
        deleteAllCookies()
        window.location.replace('https://mail.potatoserver.net/index.html');
    }else if(id == 'SendBtn'){
        document.getElementById("MailB").src = "https://mail.potatoserver.net/sendmail.html";
    }else if(id == 'AdminBtn'){
        document.getElementById("MailB").src = "https://mail.potatoserver.net/admin.html";
    }
}


function getCookie(name){
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(|$)");
    if(arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    }else{
        return null
    }
}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

function getdate(datetime){
    var time = new Date(datetime);
    
    return ['SUN','MON','TUE','WED','THU','FRI','SAT'][(time.getDay())]
}

function showMail(element){
    var id = element.id;
    document.getElementById("MailB").src = "https://mail.potatoserver.net/api/MailIndex" + String(id);
}

async function addheaderButton(){
    await fetch('https://mail.potatoserver.net/api/checkAuth',{method: 'POST',headers: {'Content-Type': 'application/json'},body: JSON.stringify({token: getCookie('token')})})
    .then(response => response.json())
    .then(admin => {
        if(admin['Admin']){
            document.getElementById('headerBox').innerHTML = `<li>
            <a href="#" class="nav-link text-white" style="display: flex; flex-direction: column;" id="AdminBtn" style="align-self: center;" onclick="method(this)">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-tools" viewBox="0 0 16 16" style="align-self: center;">
            <path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.356 3.356a1 1 0 0 0 1.414 0l1.586-1.586a1 1 0 0 0 0-1.414l-3.356-3.356a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3c0-.269-.035-.53-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814L1 0zm9.646 10.646a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708zM3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026L3 11z"/>
            </svg>
            Admin
            </a>
        </li>` + document.getElementById('headerBox').innerHTML  
        }
    })
}

async function LoadMail(){
    var token = getCookie('token');
    console.log(token);
    // if(token == null) window.location.replace("https://mail.potatoserver.net/index.html");
    await fetch('https://mail.potatoserver.net/api/MailBox',{method: 'POST',headers: {'Content-Type': 'application/json'},body: JSON.stringify({token: getCookie('token')})})
    .then((response) => response.json())
    .then(mail => {
        if(mail['success'] != undefined)window.location.replace("https://mail.potatoserver.net/index.html");
        console.log(mail)
        document.getElementById('Mailbox').innerHTML = "";
        for(const [key,value] of Object.entries(mail)) {
            var time1 = getdate(value['date'].split("T")[0])
            var text = `<a href="#" class="list-group-item list-group-item-action py-3 lh-tight border-bottom" style="display: flex; flex-direction: column;" aria-current="true" onclick="showMail(this)" id="${key}">
                            <div class="d-flex w-100 align-items-center justify-content-between">
                            <small class="mb-1">From ${value['from'][0]['name']} \< ${value['from'][0]['address']} \> </small>
                            <small class="mb-1">`
            text += time1
            text += `</small>
                            </div>
                            <div class=" mb-1 small fw-bold text-secondary">${value['subject']}</div>
                        </a>`;
            console.log(text)
            document.getElementById('Mailbox').innerHTML = text + document.getElementById('Mailbox').innerHTML;
            console.log(key,value);
        }
    })
}

function init() {
    LoadMail();
    addheaderButton();
}
init();

document.getElementById("refresh").addEventListener('click',(event) => {
    LoadMail();
});