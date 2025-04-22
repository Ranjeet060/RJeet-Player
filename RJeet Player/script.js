// DOM Elements
const song = document.getElementById("song");
const progress = document.getElementById("progress");
const ctrlIcon = document.getElementById("ctrlIcon");
const volumeControl = document.getElementById("volume-control");
const playlistContainer = document.getElementById("playlist");
const menuIcon = document.getElementById("menu-icon");
const playlistWrapper = document.getElementById("playlist-wrapper");
const fileInput = document.getElementById("song-file-input");

// Playlist State
let songsList = JSON.parse(localStorage.getItem("myPlaylist")) || [
  {
    title: "Lahore",
    artist: "Guru Randhawa",
    album: "Lahore Album",
    src: "media/Guru Randhawa_ Lahore (Official Video).mp3"
  },
  {
    title: "Mujhe Isque Sikha Kar ke",
    artist: "Sneh Upadhyay",
    album: "Sad Covers",
    src: "media/Muje Ishq Sikha Karke.mp3"
  },
  {
    title: "Blue Eyes",
    artist: "Honey Singh",
    album: "Singles",
    src: "media/Blue Eyes.mp3"
  }
];

let currentSongIndex = 0;

// Save Playlist to Local Storage
function savePlaylist() {
  localStorage.setItem("myPlaylist", JSON.stringify(songsList));
}

// Toggle Playlist Panel
menuIcon.addEventListener("click", () => {
  playlistWrapper.style.display =
    playlistWrapper.style.display === "none" ? "block" : "none";
});

// Volume Control
volumeControl.oninput = () => {
  song.volume = volumeControl.value;
};

//  Load and Play Song
function loadSong(index) {
  currentSongIndex = index;
  const track = songsList[index];
  song.src = track.src;
  document.getElementById("song-title").textContent = track.title;
  document.getElementById("song-artist").textContent = track.artist;
  document.getElementById("song-album").textContent = track.album;
  song.load();
  song.play();
  ctrlIcon.classList.replace("fa-play", "fa-pause");
  renderPlaylist();
  savePlaylist();
}

//  Toggle Play/Pause
function playPause() {
  if (song.paused) {
    song.play();
    ctrlIcon.classList.replace("fa-play", "fa-pause");
  } else {
    song.pause();
    ctrlIcon.classList.replace("fa-pause", "fa-play");
  }
}

// Next Song
function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songsList.length;
  loadSong(currentSongIndex);
}

// ⏮Previous Song
function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songsList.length) % songsList.length;
  loadSong(currentSongIndex);
}

//  Progress Bar
song.addEventListener("timeupdate", () => {
  progress.value = song.currentTime;
});

progress.addEventListener("change", () => {
  song.currentTime = progress.value;
});

song.onloadedmetadata = () => {
  progress.max = song.duration;
  progress.value = song.currentTime;
};

// Add Song from Input Fields
function addSong() {
  const title = document.getElementById("song-title-input").value.trim();
  const artist = document.getElementById("song-artist-input").value.trim();
  const album = document.getElementById("song-album-input").value.trim();
  const src = document.getElementById("song-src-input").value.trim();

  if (!title || !artist || !src) {
    return alert("Please fill all song fields.");
  }

  if (!src.match(/\.(mp3|wav|ogg)$/i)) {
    return alert("Invalid audio URL. Only .mp3, .wav, .ogg supported.");
  }

  addSongToPlaylist({ title, artist, album, src });
  clearInputs();
  loadSong(songsList.length - 1);
}

// Add Song from File Upload
fileInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const title = document.getElementById("song-title-input").value.trim() || file.name;
    const artist = document.getElementById("song-artist-input").value.trim() || "Unknown Artist";
    const album = document.getElementById("song-album-input").value.trim() || "Local Files";
    const fileURL = URL.createObjectURL(file);
    addSongToPlaylist({ title, artist, album, src: fileURL });
    clearInputs();
    loadSong(songsList.length - 1);
  }
});

//  Clear Input Fields
function clearInputs() {
  document.getElementById("song-title-input").value = "";
  document.getElementById("song-artist-input").value = "";
  document.getElementById("song-album-input").value = "";
  document.getElementById("song-src-input").value = "";
  document.getElementById("song-file-input").value = "";
}

// Render Playlist
function renderPlaylist() {
  playlistContainer.innerHTML = '';
  songsList.forEach((track, index) => {
    const li = document.createElement("li");
    li.className = "playlist-item";
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.cursor = "pointer";

    const info = document.createElement("span");
    info.textContent = `${track.title} - ${track.artist}`;
    info.onclick = () => loadSong(index);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.style.marginLeft = "10px";
    removeBtn.onclick = (e) => {
      e.stopPropagation();
      removeSongFromPlaylist(index);
    };

    li.appendChild(info);
    li.appendChild(removeBtn);
    playlistContainer.appendChild(li);
  });
}

//  Add Song to Playlist 
function addSongToPlaylist(songObj) {
  songsList.push(songObj);
  savePlaylist();
  renderPlaylist();
}

// Remove Song from Playlist
function removeSongFromPlaylist(index) {
  songsList.splice(index, 1);
  savePlaylist();
  renderPlaylist();
}

//  Clear All from LocalStorage
function clearPlaylist() {
  if (confirm("Are you sure you want to clear your saved playlist?")) {
    localStorage.removeItem("myPlaylist");
    location.reload();
  }
}

// Initialize
loadSong(currentSongIndex);
renderPlaylist();
