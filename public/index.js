const steamButton = document.getElementById("steamData");
const ownGamesButton = document.getElementById("ownData");
const nextGameButton = document.getElementById("nextGame");
const container = document.getElementById("container");

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
        // const element = document.createElement('h1');
        // element.textContent = data;
        console.log(data);
        container.textContent = data;
    })
    .catch((err)=>{
        console.log(err);
    })
})

