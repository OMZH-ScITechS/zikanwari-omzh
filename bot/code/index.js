const { Client, Intents, Message } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const request = require('request');
const url = 'https://zikanwari.f5.si/api/tomorrow.php';
var sub = '';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.channels.cache.get('970989571737288714').send('BOTが起動しました。')
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  message.reply('明日の時間割は、');
  
  request.get({
    uri: url,
    headers: {'Content-type': 'application/json'},
  }, function(err, req, data){
    var sub = data;
  });

  console.log(sub);

  for(x in sub){
    console.log(sub[x]);
  }

  message.channel.send('うえーい');
});

//client.login(process.env.TOKEN);
client.login('OTY5ODQ1MDMzMDk4NDQwNzM2.GaGITU.COt0FRagn7b5eA70u9pSpIIqwG14xyyXjVKyFE');