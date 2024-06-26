const mysql = require('mysql2');
const webpush = require('web-push');

classlist = [
    `7321`,
    `7322`,
    `7323`,
    `7324`,
    `7325`,
    `7326`,
    `7327`,
    `7328`,
    `7329`
]

let classcount = 0


webpush.setVapidDetails(
    'mailto:launchpencil@gmail.com',
    process.env.publickey,
    process.env.privatekey
);

const connection = mysql.createPool({
    host: '192.168.0.3',
    user: process.env.user,
    password: process.env.pass,
    database: 'todo',
    connectionLimit: 10
});
const connection2 = mysql.createPool({
    host: '192.168.0.3',
    user: process.env.user,
    password: process.env.pass,
    database: 'zikan',
    connectionLimit: 10
});

connection.getConnection((err) => {
    if (err) {
        console.error('error connecting: ' + err.message);
        return;
    }

    for (let i = 0; i < classlist.length; i++) {
        
        connection.query("SELECT * FROM ?? WHERE date = DATE_ADD(CURDATE(), INTERVAL 1 DAY)", [classlist[i]], (err, results, fields) => {
            if (err) {
                console.error('error querying: ' + err.stack);
                return;
            }

            console.log(classlist[i])

            let kadaistr = ''

            results.forEach((element) => {
                kadaistr += element['name'] + '、'
            });

            kadaistr = kadaistr.slice(0, -1)
        
            var payload = JSON.stringify({
                title: '明日が期限の提出物があります',
                body : kadaistr + 'の提出日が明日になっています。',
                icon: "https://app.zikanwari.f5.si/favicon.png"
            });
            if (kadaistr != '') {
                sendNotification(classlist[i], payload)
                console.log(kadaistr)
            } else {
                classcount++

            if (classcount == classlist.length) {
                    console.log('all class done!');
                    connection.end();
                    connection2.end();
                }
            }
        });
    }
});

function sendNotification(classid, payload) {

    connection2.getConnection((err) => {
        if (err) {
            console.error('error connecting: ' + err.message);
            return;
        }

        connection2.query("SELECT * FROM `user` WHERE user = ? AND kadai = 1", [classid], (err, results, fields) => {
            if (err) {
                console.error('error querying: ' + err.stack);
                return;
            }
    
            results.forEach((row) => {
                var pushSubscription = {
                    endpoint: row.endpoint,
                    keys: {
                        p256dh: row.p256dh,
                        auth: row.auth
                    }
                };

                webpush.sendNotification(
                    pushSubscription,
                    payload
                ).catch(error => {
                    console.error(error.stack);
                });

                console.log(classid + row.endpoint)
            });
            classcount++

            if (classcount == classlist.length) {
                console.log('all class done!');
                connection.end();
                connection2.end();
            }
        });
    });
}