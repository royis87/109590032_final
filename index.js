// 載入 server 程式需要的相關套件
const { Client } = require('yapople');
const cookieParser = require("cookie-parser");
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
var userdb = require('./db');
var userList;
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var morgan = require('morgan')
var api = express.Router()
var nodemailer = require("nodemailer")
var jwt = require('jsonwebtoken')
var config = require('./config');
const { ConnectionStates } = require('mongoose');
const { spawn } = require('child_process');
const shellExec = require('shell-exec');
async function userLoad(){
    userList = await userdb.reloadUser();
}

userLoad();

var port = process.env.PORT || 8080
app.set('secret', config.secret)

// 套用 middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cookieParser());
// app.use(cors);



// app.get('/', function (req, res) {
//   res.send('Hi, The API is at http://localhost:' + port + '/api')
// })

api.post('/auth', function (req, res){
  console.log(req.body)
  username = req.body.user;
  password = req.body.pass;
  console.log(username);
  console.log(password)
  if(userList[username] != undefined){
    if(userList[username]['password'] == password){
      var token = jwt.sign(userList[username],app.get('secret'),{
        expiresIn: 60*60*24
      });
      res.json({
        success: true,
        message: "GoGo",
        token: token
      });
    }else{
      res.json({success: false, message: "GoBack!"});
    }
  }else{
    res.json({success: false, message: "GoBack!"});
  }
});

api.use(function(req, res, next){
  var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies['token']
  console.log(token);
  if (token){
    jwt.verify(token, app.get('secret'),function(err, decoded){
      if(err){
        return res.json({success: false, message: "GoBack!"});
      }else{
        req.decoded = decoded;
        console.log(decoded);
        next();
      }
    })
  }else{
    res.status(403).send({
      success: false,
      message: "GoBack"
    })
  }
})

api.get('/listUser', function (req, res) {
  res.json(userList);
})

api.post('/checkAuth',async function(req, res) {
  var info = req.decoded;
  if(info['admin']){
    res.json({Admin: true});
  }else{
    res.json({Admin: false});
  }
})

api.post('/MailBox',async function(req,res) {
  var info = req.decoded;
  var mail = {};
  const client = new Client({
    host: 'mail.potatoserver.net',
    port: 995,
    tls: true,
    mailparser: true,
    username: info['user'],
    password: info['password']
  });
  await client.connect();
    const messages = await client.retrieveAll();
    var i = 0;
    messages.forEach((message) => {
      var mail_index = {};
      mail_index['subject'] = message.subject;
      mail_index['from'] = message.from;
      mail_index['date'] = message.date;
      mail_index['html'] = message.html;
      mail[i] = mail_index;
    //   console.log(message);
      i ++;
    });
    await client.quit();
    res.json(mail);
})

api.get('/MailIndex:id',async function(req, res){
  var info = req.decoded;
  var mail = {};
  const client = new Client({
    host: 'mail.potatoserver.net',
    port: 995,
    tls: true,
    mailparser: true,
    username: info['user'],
    password: info['password']
  });
  await client.connect();
    const messages = await client.retrieveAll();
    var i = 0;
    messages.forEach((message) => {
      var mail_index = {};
      mail_index['subject'] = message.subject;
      mail_index['from'] = message.from;
      mail_index['date'] = message.date;
      mail_index['html'] = message.html;
      mail[i] = mail_index;
    //   console.log(message);
      i ++;
    });
    await client.quit();
    res.send(mail[req.params["id"]].html);
});

api.post('/SendMail', async function(req, res){
  var info = req.decoded;
  const transporter = nodemailer.createTransport({
    host: "mail.potatoserver.net",
    port: 465,
    auth: {
      user: info['user'],
      pass: info['password']
    }
  });
  await transporter.sendMail({
    from: info['user'] + '@potatoserver.net',
    to: req.body.to,
    subject: req.body.subject,
    text: req.body.index
  })
  res.json({success: true});
});

api.post('/setpasswd',async function(req,res){
  var info = req.decoded;
  if(info['admin'] == false){
    res.status(403).send({
      success: false,
      message: "GoBack"
    })
  }else{
    var username = req.body.user;
    var password = req.body.pass;
    console.log(username, password);
    var admin = userList[username]['admin'];
    
    // var out = spawn('yes' , password, '|','passwd' , username);
    var out = await shellExec('yes ' + password + ' | passwd ' + username);
    
    const config = {
      user: username,
      admin: admin,
      password: password
    };
    await userdb.admin.firestore().collection("mail_user").doc(userList[username]['id']).set(config)
    .then(() => {
        console.log('success');
    })

    await userLoad();
    res.json({success: true});
  }
});

api.post('/addUser',async function(req,res){
  var info = req.decoded;
  if(info['admin'] == false){
    res.status(403).send({
      success: false,
      message: "GoBack"
    })
  }else{
    var username = req.body.user;
    var password = req.body.pass;
    // var out = spawn('yes' , password, '|','passwd' , username);
    var out = await shellExec('useradd -m -s /bin/bash ' + username);
    var out1 = await shellExec('yes ' + password + ' | passwd ' + username);
    const config = {
      user: username,
      admin: false,
      password: password
    };
    console.log(config);
    await userdb.admin.firestore().collection("mail_user").add(config)
    .then(() => {
        console.log('success');
    })
    await userLoad();
    res.json({success: true});
  }
});

api.post('/delUser',async function(req,res){
  var info = req.decoded;
  if(info['admin'] == false){
    res.status(403).send({
      success: false,
      message: "GoBack"
    })
  }else{
    var username = req.body.user;
    // var out = spawn('yes' , password, '|','passwd' , username);
    var out = await shellExec('userdel -f ' + username);
    await userdb.admin.firestore().collection("mail_user").doc(userList[username]['id']).delete()
    .then(() => {
        console.log('success');
    })
    await userLoad();
    res.json({success: true});
  }
});

app.use('/api', api);

app.use(express.static(__dirname + '/web'));
app.use(express.static(__dirname + '/mailbox'));
app.use(express.static(__dirname + '/sendmail'));
app.use(express.static(__dirname + '/admin'));
app.listen(port, function () {
  console.log('The server is running at http://localhost:' + port)
})