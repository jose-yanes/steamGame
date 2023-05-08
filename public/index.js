const steamButton = document.getElementById("steamData");
const ownGamesButton = document.getElementById("ownData");
const nextGameButton = document.getElementById("nextGame");
const container = document.getElementById("container");
const containerTitle = document.getElementById("containerTitle");
const gameSummary = document.getElementById("gameSummary");
const coverIMG = document.getElementById("coverIMG");

steamButton.addEventListener('click', (e)=>{
    alert("Data is being downloaded, please wait");
    fetch('/steamButton',{method:'POST'})
    .then((response)=>{
        if(response.ok){
            console.log("Data Saved");
            return;
        }
    })
    .catch((err)=>{
        console.log(err);
    })
})

ownGamesButton.addEventListener('click', (e)=>{
    alert("Data is being downloaded, please wait");
    fetch('/ownButton',{method:'POST'})
    .then((response)=>{
        if(response.ok){
            console.log("Data Saved");
            return;
        }
    })
    .catch((err)=>{
        console.log(err);
    })
})

nextGameButton.addEventListener('click', (e)=>{
    fetch('/nextGame',{method:'POST'})
    .then((response)=>{
        if(response.ok){
            return response.json();
        }
    }).then((data)=>{
        console.log(data);
        containerTitle.textContent = "Next Game"
        container.textContent = data.name;
        gameSummary.innerHTML = data.summary;
        const coverURL = data.cover.replace('/','');
        coverIMG.src = `https://${coverURL}`

        
    })
    .catch((err)=>{
        console.log(err);
    })
})

