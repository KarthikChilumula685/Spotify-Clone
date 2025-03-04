    // console.log("Let's write JavaScript!");
    // let currentSong = new Audio();
    // async function getSongs() {
    //     try {
    //         let a = await fetch("http://127.0.0.1:3000/assets/songs/");
    //         let response = await a.text();
            
    //         let div = document.createElement("div");
    //         div.innerHTML = response;

    //         let as = div.getElementsByTagName("a");
    //         let songs = [];

    //         for (let index = 0; index < as.length; index++) {
    //             const element = as[index];
    //             if (element.href.endsWith(".mp3")) {
    //                 songs.push(element.href);
    //             }
    //         }

    //         return songs;
    //     } catch (error) {
    //         console.error("Error fetching songs:", error);
    //         return [];
    //     }
    // }
    // const playMusic = (track) => {
    //     let encodedTrack = encodeURIComponent(track.trim()); // Encodes spaces and special characters
    //     currentSong.src = `/assets/songs/${encodedTrack}.mp3`; // Ensure correct path
    //     currentSong.play();
    // };
    
    // async function main() {
    //     let songs = await getSongs();
    //     let songUI = document.querySelector(".songList").getElementsByTagName("ul")[0];
    //     for (const song of songs) {
    //         songUI.innerHTML = songUI.innerHTML + `
    //                     <li>
    //                             <img class="invert" src="assets/img/music.svg" alt="">
    //                             <div class="info">
    //                                 <div>${song.replaceAll("%20", " ").replaceAll("http://127.0.0.1:3000/assets/songs/"," ").replaceAll(".mp3"," ").replaceAll(" - SenSongsMp3.Co"," ").replaceAll("-SenSongsMp3.Co"," ")}</div>
    //                                 <div>Artist</div>
    //                             </div>
    //                             <div class="playNow">
    //                                 <span>Play Now</span>
    //                                 <img class="invert" src="assets/img/play.svg" alt="">
    //                             </div>
    //                         </li>
    //     `
    //     }
        // Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        //     e.addEventListener("click",ele=>{
        //         playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        //     })
        // })
    // }

    // main()
    console.log("Let's write JavaScript!");
    let currentSong = new Audio();
    function formatTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        let remainingSeconds = Math.floor(seconds % 60); 
    
        
        let formattedMinutes = String(minutes).padStart(2, "0");
        
        let formattedSeconds = String(remainingSeconds).padStart(2, "0");
    
        return `${formattedMinutes}:${formattedSeconds}`;
    }
    async function getSongs() {
        try {
            let a = await fetch("http://127.0.0.1:3000/assets/songs/");
            let response = await a.text();
            
            let div = document.createElement("div");
            div.innerHTML = response;
    
            let as = div.getElementsByTagName("a");
            let songs = [];
    
            for (let index = 0; index < as.length; index++) {
                const element = as[index];
                if (element.href.endsWith(".mp3")) {
                    songs.push(decodeURIComponent(element.href)); // Decode URL to fix encoding issues
                }
            }
    
            return songs;
        } catch (error) {
            console.error("Error fetching songs:", error);
            return [];
        }
    }
    
    const playMusic = (songUrl,songName,pause=false) => {
        // console.log("Playing:", songUrl); // Debugging line
        currentSong.src = songUrl;  // Directly use the URL from `getSongs()`
        if(!pause){
            currentSong.play();
            play.src = "assets/img/pause.svg";
        }
        const songInfo = document.getElementsByClassName("songinfo")[0];
        const songList = songInfo.getElementsByTagName("ul")[0];
        songList.innerHTML = `
            <li>${songName}</li>
            <li>Artist</li>
        `;

    };
    
    async function main() {
        let songs = await getSongs();
        let firstSongName = songs[0].replaceAll("%20", " ").replaceAll("http://127.0.0.1:3000/assets/songs/"," ").replaceAll(".mp3"," ").replaceAll(" - SenSongsMp3.Co"," ").replaceAll("-SenSongsMp3.Co"," ").trim();
        playMusic(songs[0],firstSongName,true);
        let songUI = document.querySelector(".songList").getElementsByTagName("ul")[0];
    
        for (const song of songs) {
            let songName = song.replaceAll("%20", " ").replaceAll("http://127.0.0.1:3000/assets/songs/"," ").replaceAll(".mp3"," ").replaceAll(" - SenSongsMp3.Co"," ").replaceAll("-SenSongsMp3.Co"," ").trim();
    
            songUI.innerHTML += `
                <li>
                    <img class="invert" src="assets/img/music.svg" alt="">
                    <div class="info">
                        <div>${songName}</div>
                        <div>Artist</div>
                    </div>
                    <div class="playNow">
                        <span>Play Now</span>
                        <img class="invert" src="assets/img/play.svg" alt="">
                    </div>
                </li>
            `;
        }
    
        Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", () => {
                let songName = e.querySelector(".info").firstElementChild.innerHTML.trim();
                let songUrl = songs.find(s => s.includes(songName)); // Find the original URL
                if (songUrl) {
                    playMusic(songUrl,songName);
                } else {
                    console.error("Song not found:", songName);
                }
            });
        });

        play.addEventListener("click", () => {
            if (currentSong.paused) { 
                currentSong.play();
                play.src = "assets/img/pause.svg"; 
            } else {
                currentSong.pause();
                play.src = "assets/img/play.svg"; 
            }
        });
        
        currentSong.addEventListener("timeupdate",()=>{
            document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
            document.querySelector(".circle").style.left =( currentSong.currentTime / currentSong.duration)*100 + '%';
        })

        document.querySelector(".seekbar").addEventListener("click", (e) => {
            let seekbar = e.target;  // Ensure we refer to the clicked seekbar
            let percentage = (e.offsetX / seekbar.getBoundingClientRect().width) * 100;
        
            let circle = document.querySelector(".circle");
            if (circle) {
                circle.style.left = percentage + "%";
            } else {
                console.error("Seekbar indicator (.circle) not found!");
            }
        
            if (currentSong && !isNaN(currentSong.duration)) {
                currentSong.currentTime = (currentSong.duration * percentage) / 100;
            } else {
                console.error("Audio element not found or duration not loaded!");
            }
        });
        

    }
    
    main();
    