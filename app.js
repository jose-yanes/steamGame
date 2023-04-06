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
 * Search how to use VIEWS with mongoose, in order to change the ownGame.aggregate since is taking so much time.
 * 
 * API that gives you images or data about a game?
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

        const getRandomNum = (max) =>{
            return Math.floor(Math.random() * max + 1);
        }
        const gameNumber = getRandomNum(419);
        console.log(`gameNumber ${gameNumber}`);


        ownGame.aggregate([
            {
                $lookup: {
                    from: 'steamgames',
                    localField: 'appid',
                    foreignField: 'appid',
                    as: 'match'
                }
            }
          ])
          .then((matchedGames)=>{
            const nextGame = matchedGames[gameNumber];
            console.log(nextGame.match[0].name)
            res.json(nextGame.match[0].name);
          })
          .catch((err)=>{
            console.log(err);
            res.send("Sorry :/")
          })
    }
})


app.listen(3000,()=>{
    console.log("Server started")
})
