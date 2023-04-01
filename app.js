const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

const STEAM_API = process.env.STEAM_API;
const STEAM_ID = process.env.STEAM_ID;

/**
 * TODO
 * Validate if data already exist don't save it again
 * 
 * how to do JOINS in mongo
 * 
 * API that gives you images or data about a game?
 */

mongoose.connect("mongodb://localhost:27017/steamGames")

const steamGameSchema = new mongoose.Schema({
    appid: Number,
    name: String
});

const steamGame = mongoose.model("steamGame",steamGameSchema);

const ownGameSchema = new mongoose.Schema({
    appid: Number
})

const ownGame = mongoose.model("ownGame",ownGameSchema);


app.route("/")
.get((req,res)=>{
    res.sendFile(`${__dirname}/index.html`);
})


app.route("/:buttons")
.post((req,res)=>{

    const buttonParams = req.params.buttons;
    if(buttonParams === 'steamButton'){
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
                        counter++;
                    })

                });
            })
        })
    }else if(buttonParams === 'ownButton'){
        https.get(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API}&steamid=${STEAM_ID}&format=json`,(resp)=>{
            console.log(resp.statusCode);
            let resultData = '';

            resp.on('data',data => resultData += data);
            resp.on('end',()=>{
                const completeData = JSON.parse(resultData);
                const ownGamesArr = completeData.response.games;
                let counter = 1;
                ownGamesArr.forEach(element => {
                    const newOwnGame = new ownGame({
                        appid: element.appid
                    })
                    newOwnGame.save().then(()=>{
                        console.log(element.appid);
                        console.log(`Successfully added ${counter} from ${ownGamesArr.length} own games`)
                        counter++;
                    })
                });

            })
        })
    }


})

app.listen(3000,()=>{
    console.log("Server started")
})
