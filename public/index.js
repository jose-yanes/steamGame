const steamButton = document.getElementById("steamData");
const ownGamesButton = document.getElementById("ownData");

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

