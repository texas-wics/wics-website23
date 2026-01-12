document.addEventListener("DOMContentLoaded", () => {

    const playlist = [
        { title: "Piano Rock", src: "https://cdn.jsdelivr.net/gh/ananyachintalapudi/wics-music26@main/70s-piano-rock-4007.mp3" },
        { title: "Canvas of Soul", src: "https://cdn.jsdelivr.net/gh/ananyachintalapudi/wics-music26@main/canvas-of-her-soul-431339.mp3" },
        { title: "Catchy and Funky", src: "https://cdn.jsdelivr.net/gh/ananyachintalapudi/wics-music26@main/catchy-and-funky-70-s-294575.mp3" },
        { title: "Lost in the Soul", src: "https://cdn.jsdelivr.net/gh/ananyachintalapudi/wics-music26@main/lost-in-the-soul-438449.mp3" }
    ];

    let currentTrack = 0;
    let isPlaying = false;
    let shouldAutoPlay = false; // Track if we should auto-play after loading

    const audio = document.getElementById("audio");
    const playBtn = document.getElementById("play");
    const nextBtn = document.getElementById("next");
    const prevBtn = document.getElementById("prev");
    const trackName = document.getElementById("track-name");
    const vinyl = document.getElementById("vinyl");
    const radioImg = document.querySelector(".radio-img");

    if (!audio || !playBtn || !vinyl) return;

    // Set CORS attribute
    audio.crossOrigin = "anonymous";

    let pulseInterval;

    function updateRadioImage() {
        if (radioImg) {
            if (isPlaying) {
                radioImg.classList.remove("paused");
                radioImg.classList.add("playing");
                
                // Clear any existing pulse interval
                if (pulseInterval) clearInterval(pulseInterval);
                
                // Set up pulse interval to switch images
                let isLarge = false;
                pulseInterval = setInterval(() => {
                    isLarge = !isLarge;
                    radioImg.src = isLarge 
                        ? "images/hackathon26/hack26_radio_big.png"
                        : "images/hackathon26/hack26_radio_small.png";
                }, 750); // Half of 1.5s animation duration
            } else {
                radioImg.classList.remove("playing");
                radioImg.classList.add("paused");
                
                // Clear pulse interval and reset to small image
                if (pulseInterval) clearInterval(pulseInterval);
                radioImg.src = "images/hackathon26/hack26_radio_small.png";
            }
        }
    }

    function loadTrack(index, autoPlay = false) {
        audio.src = playlist[index].src;
        if (trackName) trackName.textContent = playlist[index].title;
        shouldAutoPlay = autoPlay;
    }

    function startPlayback() {
        vinyl.classList.add("spinning");
        playBtn.textContent = "⏸";
        isPlaying = true;
        updateRadioImage();
    }

    function stopPlayback() {
        vinyl.classList.remove("spinning");
        playBtn.textContent = "▶";
        isPlaying = false;
        updateRadioImage();
    }

    function playPause() {
        if (isPlaying) {
            audio.pause();
            stopPlayback();
        } else {
            audio.play().catch(error => console.error("Play error:", error));
            startPlayback();
        }
    }

    function nextTrack() {
        currentTrack = (currentTrack + 1) % playlist.length;
        loadTrack(currentTrack, true); // Set to autoPlay
        audio.currentTime = 0;
        
        // Trigger canplay event handler to start playing
        audio.play().catch(error => console.error("Play error on skip:", error));
        startPlayback();
    }

    function prevTrack() {
        currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrack, true); // Set to autoPlay
        audio.currentTime = 0;
        
        // Trigger canplay event handler to start playing
        audio.play().catch(error => console.error("Play error on skip:", error));
        startPlayback();
    }

    // Event listeners
    playBtn.addEventListener("click", playPause);
    nextBtn.addEventListener("click", nextTrack);
    prevBtn.addEventListener("click", prevTrack);
    
    audio.addEventListener("ended", () => {
        nextTrack();
    });

    // Handle autoplay when track is ready
    audio.addEventListener("canplay", () => {
        if (shouldAutoPlay && audio.paused) {
            audio.play().catch(error => console.error("Play error on canplay:", error));
        }
    });

    document.addEventListener("click", () => {
        if (!isPlaying) {
            audio.play().catch(error => console.error("Play error on click:", error));
            startPlayback();
        }
    }, { once: true });

    loadTrack(currentTrack);
    updateRadioImage();
});