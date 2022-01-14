var send = document.getElementById('Send');
send.addEventListener('click',async (event) => {
    var To = document.getElementById('to').value;
    var Subject = document.getElementById('Subject').value;
    var Message = document.getElementById('message').value;
    await fetch('https://mail.potatoserver.net/api/SendMail',{method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({to: To, subject: Subject, index: Message})})
    window.location.replace("https://mail.potatoserver.net/sendend.html");
});
