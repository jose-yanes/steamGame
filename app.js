const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mongoose = require("mongoose");

const app = express();


app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/steamGames")

const steamGameSchema = new mongoose.Schema({
    appid: Number,
    name: String
});

const steamGame = mongoose.model("steamGame",steamGameSchema);


app.route("/")
.get((req,res)=>{
    res.sendFile(`${__dirname}/index.html`);
})
.post((req,res)=>{
    https.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/', (resp)=>{
        console.log(resp.statusCode);
        let resultData = '';

        resp.on('data',data => resultData += data);
        resp.on('end',()=>{
            const completeData = JSON.parse(resultData);
            const appIdList = completeData.applist.apps;
            let counter = 1;
            appIdList.forEach(element => {
                const newSteamGame = new steamGame({
                    appid: element.appid,
                    name: element.name
                });
                newSteamGame.save().then(()=>{
                    console.log(`Successfully added ${counter} from ${appIdList.length} games`)
                })
                console.log(counter);
                counter++;
            });
        })
    })
})

app.listen(3000,()=>{
    console.log("Server started")
})
