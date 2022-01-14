var admin = require("firebase-admin");
var serviceAccount = require("./ntut-web-905c4-firebase-adminsdk-tczzz-91021f5eaf.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports.reloadUser = async function (){
    var userList = {};
    var index = 0;
    var db = await admin.firestore().collection("mail_user").get()
    .then(docList => {
        docList.forEach(doc => {
            const user = doc.data();
            userList[user.user] = user;
            userList[user.user]['id'] = doc.id;
        });
    });
    console.log(userList);
    return userList;
}

module.exports.admin = admin;

module.exports.setpassword = async (user,password) => {
    var username = user['name'];
    var admin = user['admin'];
    const config = {
        user: username,
        admin: admin,
        password: password
    };
    await admin.firestore().collection("mail_user").doc(user['id']).set(config)
    .then(() => {
        console.log('success');
    })
    .catch(error => console.error('Error writing document: ', error));
}
