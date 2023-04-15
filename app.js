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
 * https://mongoosejs.com/docs/middleware.html#pre  ??
 * 
 * API that gives you images or data about a game?
 * 
 * Try to create a different interface if the user is logged or not{
 *  if the user is not logged, then choose a random game from the entire SteamLibrary.
 *  if logged, use their own games
 * }
 * 
 * (optional) create a new table 'completedGames' so it could check if the game selected was already completed and choose a new one.
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
    res.sendFile
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
    }else if(buttonParams === 'nextGame'){



        ownGame.find({})
        .then((ownGameArr) =>{

            const getRandomNum = (max) =>{
                return Math.floor(Math.random() * max + 1);
            }

            const gameNumber = getRandomNum(ownGameArr.length);
            console.log(`gameNumber ${gameNumber}`);

            steamGame.findOne({appid:ownGameArr[gameNumber].appid})
            .then((randomGameName)=>{
                console.log(randomGameName.name);
                res.json(randomGameName.name);
            })
            .catch((err)=>{
                console.log(err);
            })
        })
        .catch((err)=>{
            console.log(err);
        })
    }
})


app.listen(3000,()=>{
    console.log("Server started")
})
