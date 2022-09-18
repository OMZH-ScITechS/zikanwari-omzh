const https = require("https")
const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000
const TOKEN = process.env.LINE_ACCESS_TOKEN

//honhe
const request = require('request');
const URL = 'http://zikanwari/api/tomorrow.php';

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.get("/", (req, res) => {
  res.sendStatus(200)
})

app.post("/webhook", function(req, res) {
  res.send("HTTP POST request sent to the webhook URL!")
  if (req.body.events[0].type === "message") {
    var time = 0;
  
  request.get({
    uri: URL,
    headers: {'Content-type': 'application/json'},
  }, function(err, req, data){
    a = data.split(',');
    a.pop();
    var msg1 = '明日(' + a[6] + ')の時間割は、';
    var msg2;
    for(x in a){

        sub = a[x];

        time++;

        if (time > 6) {
          break;
        }

        msg2 += time + '時間目：' + sub;

      }});
    const dataString = JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: [
        {
          "type": "text",
          "text": msg1
        },
        {
          "type": "text",
          "text": msg2
        }
      ]
    })

    // リクエストヘッダー
    const headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + TOKEN
    }

    // リクエストに渡すオプション
    const webhookOptions = {
      "hostname": "api.line.me",
      "path": "/v2/bot/message/reply",
      "method": "POST",
      "headers": headers,
      "body": dataString
    }

    // リクエストの定義
    const request = https.request(webhookOptions, (res) => {
      res.on("data", (d) => {
        process.stdout.write(d)
      })
    })

    // エラーをハンドル
    request.on("error", (err) => {
      console.error(err)
    })

    // データを送信
    request.write(dataString)
    request.end()
  }
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})