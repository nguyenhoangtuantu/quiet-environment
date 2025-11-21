// Simple Music Player with fallback
class MusicPlayer {
  constructor() {
    this.audio = new Audio();
    this.tracks = this.createSampleTracks();
    this.currentTrackIndex = 0;
    this.isPlaying = false;
    this.volume = 0.5;

    this.audio.volume = this.volume;
    this.setupEventListeners();
    this.renderTrackList();
    this.renderPlayerControls();
  }

  createSampleTracks() {
    // Sử dụng base64 audio hoặc URL online nếu có
    return [
      {
        name: "Lofi Chill Beats",
        file: "assets/music/lofi-chill.mp3",
        artist: "Chill Vibes",
      },
      {
        name: "Peaceful Piano",
        file: "assets/music/peaceful-piano.mp3",
        artist: "Piano Masters",
      },
      {
        name: "Ocean Waves",
        file: "assets/music/ocean-waves.mp3",
        artist: "Nature Sounds",
      },
      {
        name: "Rain Sounds",
        file: "assets/music/rain-sounds.mp3",
        artist: "Nature Therapy",
      },
      {
        name: "Forest Ambience",
        file: "assets/music/forest-ambience.mp3",
        artist: "Forest Sounds",
      },
    ];
  }

  setupEventListeners() {
    this.audio.addEventListener("ended", () => this.nextTrack());
    this.audio.addEventListener("timeupdate", () => this.updateProgress());
    this.audio.addEventListener("loadedmetadata", () => this.updateDuration());
  }

  renderTrackList() {
    const trackList = document.getElementById("trackList");
    if (!trackList) return;

    trackList.innerHTML = "";

    this.tracks.forEach((track, index) => {
      const item = document.createElement("div");
      item.className = "track-item";
      item.innerHTML = `
                <div class="track-info">
                    <div class="track-name">${track.name}</div>
                    <div class="track-artist">${track.artist}</div>
                </div>
                <div class="track-duration">--:--</div>
            `;
      item.onclick = () => this.playTrack(index);
      trackList.appendChild(item);
    });
  }

  renderPlayerControls() {
    const musicPlayer = document.querySelector(".music-player");
    if (!musicPlayer) return;

    // Remove existing controls if any
    const existingControls = musicPlayer.querySelector(".player-controls");
    if (existingControls) {
      existingControls.remove();
    }

    const controls = document.createElement("div");
    controls.className = "player-controls";
    controls.innerHTML = `
            <div class="progress-container">
                <div class="progress-bar" onclick="musicPlayer.seek(event)">
                    <div class="progress" id="progress"></div>
                </div>
                <div class="time-display">
                    <span id="currentTime">0:00</span> / <span id="totalTime">0:00</span>
                </div>
            </div>
            <div class="control-buttons">
                <button class="control-btn-small" onclick="window.musicPlayer.prevTrack()">⏮️</button>
                <button class="control-btn-small" id="playPauseBtn" onclick="window.musicPlayer.togglePlay()">▶️</button>
                <button class="control-btn-small" onclick="window.musicPlayer.nextTrack()">⏭️</button>
                <button class="control-btn-small" id="muteBtn" onclick="window.musicPlayer.toggleMute()">🔊</button>
                <input type="range" id="volumeSlider" min="0" max="100" value="50" 
                       oninput="window.musicPlayer.setVolume(this.value/100)">
            </div>
            <div class="now-playing" id="nowPlaying">
                Chọn bài hát để bắt đầu nghe...
            </div>
        `;

    musicPlayer.appendChild(controls);
  }

  async playTrack(index) {
    this.currentTrackIndex = index;
    const track = this.tracks[index];

    try {
      this.audio.src = track.file;
      await this.audio.play();
      this.isPlaying = true;
      this.updatePlayButton();
      this.highlightCurrentTrack();
      this.updateNowPlaying(track);
    } catch (error) {
      console.log("Lỗi phát nhạc:", error);
      this.showFallbackMessage(track);
    }
  }

  togglePlay() {
    if (!this.audio.src) {
      this.playTrack(0);
      return;
    }

    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    this.isPlaying = !this.isPlaying;
    this.updatePlayButton();
  }

  updatePlayButton() {
    const btn = document.getElementById("playPauseBtn");
    if (btn) {
      btn.textContent = this.isPlaying ? "⏸️" : "▶️";
    }
  }

  nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    this.playTrack(this.currentTrackIndex);
  }

  prevTrack() {
    this.currentTrackIndex =
      (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.playTrack(this.currentTrackIndex);
  }

  setVolume(value) {
    this.volume = value;
    this.audio.volume = value;
  }

  toggleMute() {
    this.audio.muted = !this.audio.muted;
    const btn = document.getElementById("muteBtn");
    if (btn) {
      btn.textContent = this.audio.muted ? "🔇" : "🔊";
    }
  }

  seek(event) {
    if (!this.audio.duration) return;

    const progressBar = event.currentTarget;
    const clickPosition = event.offsetX;
    const progressBarWidth = progressBar.offsetWidth;
    const percentage = clickPosition / progressBarWidth;

    this.audio.currentTime = percentage * this.audio.duration;
  }

  updateProgress() {
    if (this.audio.duration) {
      const progress = (this.audio.currentTime / this.audio.duration) * 100;
      const progressBar = document.getElementById("progress");
      if (progressBar) {
        progressBar.style.width = progress + "%";
      }

      const currentTime = document.getElementById("currentTime");
      const totalTime = document.getElementById("totalTime");

      if (currentTime)
        currentTime.textContent = this.formatTime(this.audio.currentTime);
    }
  }

  updateDuration() {
    const totalTime = document.getElementById("totalTime");
    if (totalTime && this.audio.duration) {
      totalTime.textContent = this.formatTime(this.audio.duration);
    }
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  highlightCurrentTrack() {
    document.querySelectorAll(".track-item").forEach((item, index) => {
      item.classList.toggle("active", index === this.currentTrackIndex);
    });
  }

  updateNowPlaying(track) {
    const nowPlaying = document.getElementById("nowPlaying");
    if (nowPlaying) {
      nowPlaying.innerHTML = `
                <strong>Đang phát:</strong> ${track.name}<br>
                <em>${track.artist}</em>
            `;
    }
  }

  showFallbackMessage(track) {
    const nowPlaying = document.getElementById("nowPlaying");
    if (nowPlaying) {
      nowPlaying.innerHTML = `
                <strong>Demo:</strong> ${track.name}<br>
                <em>Thêm file MP3 để phát nhạc thật</em>
            `;
    }

    // Tạo âm thanh demo đơn giản
    this.createDemoSound();
  }

  createDemoSound() {
    // Tạo âm thanh demo đơn giản bằng Web Audio API
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 440;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 2
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 2);
    } catch (error) {
      console.log("Không thể tạo âm thanh demo");
    }
  }
}

// Khởi tạo music player khi trang load
let musicPlayer;

function initMusicPlayer() {
  musicPlayer = new MusicPlayer();
  window.musicPlayer = musicPlayer; // Make it globally available
}

// Khởi tạo khi DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMusicPlayer);
} else {
  initMusicPlayer();
}
