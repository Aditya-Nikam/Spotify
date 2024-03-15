console.log("Let write js")


const jsmediatags = window.jsmediatags;
let audio = new Audio()

class Artistobj {
    constructor(song_name, song_url, artist_name, img_url) {
        this.song_name = song_name;
        this.song_url = song_url;
        this.artist_name = artist_name;
        this.img_url = img_url;
    }
}

function secondsToMinutesSeconds(seconds) {

    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    
    // Add leading zeros if necessary
    var minutesString = minutes < 10 ? "0" + minutes : minutes;
    var secondsString = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

    if(isNaN(minutes)|| isNaN(remainingSeconds)) {
        return "00:00";
    }
    return minutesString + ":" + secondsString;
}

function calculateSongProgress(currentTime, duration) {
    if (currentTime < 0 || duration <= 0) {
        console.error("Invalid input. Time and duration must be positive values.");
        return null;
    }
    
    if (currentTime > duration) {
        console.error("Current time cannot be greater than the duration of the song.");
        return null;
    }
    
    var percentPlayed = (currentTime / duration) * 100;
    return percentPlayed;
}


async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text()


    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")

    let songs = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)
        }
    }
    return songs
}

async function getimages() {
    let a = await fetch("http://127.0.0.1:5500/img/")
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let images = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".jpg")) {
            images.push(element.href)
        }
    }
    return images
}
function getArtist(song) {
    return new Promise((resolve, reject) => {
        jsmediatags.read(song, {
            onSuccess: function (tag) {
                resolve(tag.tags);
            },
            onError: function (err) {
                reject(err);
            }
        });
    });
}
async function playMusic(track){
    // let audio = new Audio("/songs/"+track+".mp3")
    // console.log("/songs/"+track+".mp3")
    audio.src= "/songs/" + track + ".mp3"
    console.log("/songs/" + track + ".mp3")
    play.src='svg/pause.svg'

    let div=document.querySelector(".songinfo")
    div.innerHTML=`
    <img src="${"/img/" + track + ".jpg"}" alt="banner">
    <p>${track}</p>
    `
    audio.play()
}

(async function main() {
    let arr = []
    let songs = await getSongs()
    // console.log(songs)

    let images = await getimages()
    // console.log(images)

    for (const song of songs) {
        for (const img of images) {
            let sname = song.split("/songs/")[1].split(".mp3")[0]
            let imgname = img.split("/img/")[1].split(".jpg")[0]
            if (sname == imgname) {
                let artist = await getArtist(song)
                // console.log(artist)
                arr.push(new Artistobj(artist.title, song, artist.artist, img))

                let div = document.querySelector(".left-playlist")
                div.innerHTML += `
                <div class="left-card flex">
                <img src="${img}" alt="cover">
                <div class="artist">
                   <h3 class="roboto-thin-small">${artist.title}</h3>
                   <h5 class="roboto-thin-small color-gray2">${artist.artist}</h5>
                </div>
                <img class="play" src="svg/play.svg" alt="Play Button"/>
              </div>`


              let div2=document.querySelector(".card-container")
                div2.innerHTML+=`<div class="card">
                <img class="play" src="svg/play.svg" alt="Play Button"/>
                <img src="${img}" alt="playlist cover">
                <h3 class="align-items-center">${artist.title}</h3>
                <p>${artist.album}</p>
               </div>`
            }
        }
    }
    console.log(document.querySelector(".left-playlist"))
    Array.from(document.querySelector(".left-playlist").getElementsByTagName("h3")).forEach(e=>{
       e.addEventListener( 'click', ()=>{
        playMusic(e.innerHTML.trim())
       })
    })

    play.addEventListener("click",()=>{
        if(audio.paused){
            audio.play()
            play.src='svg/pause.svg'
        }else{
            audio.pause()
            play.src='svg/playsong.svg'
        }
    })

    audio.addEventListener("timeupdate",()=>{
        if(audio.duration!=NaN && audio.currentTime!=NaN) {
            document.querySelector(".songtime").innerHTML=`<p>${secondsToMinutesSeconds(Math.floor(audio.currentTime))}/${secondsToMinutesSeconds(Math.floor(audio.duration))}</p>`
        }

        document.querySelector(".circle").style.left=`${calculateSongProgress(audio.currentTime,audio.duration)}%`
    })

    document.querySelector(".seekbar").addEventListener("click",(e)=>{
        let percent =e.offsetX/e.target.getBoundingClientRect().width;
        document.querySelector(".circle").style.left= percent*100+"%";
        // console.log((e.offsetX/e.target.getBoundingClientRect().width)*100)
        audio.currentTime=(audio.duration * percent );
    })



})()