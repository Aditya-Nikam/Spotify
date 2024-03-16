


const jsmediatags = window.jsmediatags;
let audio = new Audio()
let songs;

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
    let a = await fetch("/songs/")
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
    let a = await fetch("/img/")
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
    audio.src= "/songs/" + track + ".mp3"
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
    songs = await getSongs()

    let images = await getimages()

    for (const song of songs) {
        for (const img of images) {
            let sname = song.split("/songs/")[1].split(".mp3")[0]
            let imgname = img.split("/img/")[1].split(".jpg")[0]
            if (sname == imgname) {
                let artist = await getArtist(song)
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
    // console.log(document.querySelector(".left-playlist"))
    Array.from(document.querySelectorAll(".left-card")).forEach(e=>{
       e.addEventListener( 'click', ()=>{
            let track = e.querySelector("h3").innerHTML.trim()
            playMusic(track)
       })
    })
    // console.log(document.querySelector(".card-container"))
    Array.from(document.querySelectorAll(".card")).forEach(e=>{
        e.addEventListener( 'click', ()=>{
            let track = e.querySelector("h3").innerHTML.trim()
            playMusic(track)
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
        audio.currentTime=(audio.duration * percent );
    })

    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0%"
        document.querySelector(".left").style.display="inline"
    })

    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%"
    })

    prev.addEventListener("click",()=>{
        let index = songs.indexOf(audio.currentSrc);
        if(index>0){
            let track = songs[index-1].split("/").slice(-1)[0].split(".").slice(0)[0]
            track=track.replaceAll("%20"," ")
            playMusic(track)
        }else{
            let track = songs[songs.length-1].split("/").slice(-1)[0].split(".").slice(0)[0]
            track=track.replaceAll("%20"," ")
            playMusic(track)
        }
    })

    next.addEventListener("click",()=>{
        let index = songs.indexOf(audio.currentSrc);
        if(index<songs.length-1){
            let track = songs[index+1].split("/").slice(-1)[0].split(".").slice(0)[0]
            track=track.replaceAll("%20"," ")
            playMusic(track)
        }else{
            let track = songs[0].split("/").slice(-1)[0].split(".").slice(0)[0]
            track=track.replaceAll("%20"," ")
            playMusic(track)
        }
    })

    prev1.addEventListener("click",()=>{
        let index = songs.indexOf(audio.currentSrc);
        if(index>0){
            let track = songs[index-1].split("/").slice(-1)[0].split(".").slice(0)[0]
            track=track.replaceAll("%20"," ")
            playMusic(track)
        }else{
            let track = songs[songs.length-1].split("/").slice(-1)[0].split(".").slice(0)[0]
            track=track.replaceAll("%20"," ")
            playMusic(track)
        }
    })

    next1.addEventListener("click",()=>{
        let index = songs.indexOf(audio.currentSrc);
        if(index<songs.length-1){
            let track = songs[index+1].split("/").slice(-1)[0].split(".").slice(0)[0]
            track=track.replaceAll("%20"," ")
            playMusic(track)
        }else{
            let track = songs[0].split("/").slice(-1)[0].split(".").slice(0)[0]
            track=track.replaceAll("%20"," ")
            playMusic(track)
        }
    })

    document.querySelector(".range").addEventListener("change",(e)=>{
        audio.volume=parseInt(e.target.value)/100
        if(e.target.value==0){
            document.querySelector(".volume").getElementsByTagName("img")[0].src="svg/volumemute.svg"
        }else if(e.target.value<=50){
            document.querySelector(".volume").getElementsByTagName("img")[0].src="svg/volumelow.svg"
        }else if(e.target.value>50){
            document.querySelector(".volume").getElementsByTagName("img")[0].src="svg/volumehigh.svg"
        }
    })
    document.querySelector(".volume").getElementsByTagName("img")[0].addEventListener("click",()=>{
        if(audio.volume>0){
            audio.volume=0
            document.querySelector(".volume").getElementsByTagName("img")[0].src="svg/volumemute.svg"
        }else{
            document.querySelector(".volume").getElementsByTagName("img")[0].src="svg/volumelow.svg"
            audio.volume=(document.querySelector(".range").value)/100
        }
    })
})()