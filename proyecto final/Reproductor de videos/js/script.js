let url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyAeGHrtA-kJeD1q3apHjM02FjVYT7R2t34';
let player;
let currentVideoId = ''; 
function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-player', {
        width: '100%',
        height: '100%',
        videoId: '', 
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange
        }
    });
}
function onPlayerReady(event) {
    console.log("Player is ready!");
}
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        document.getElementById('play-pause').textContent = '❚❚';
    } else {
        document.getElementById('play-pause').textContent = '▶';
    }
}
document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-bar').value;
    if (query) {
        fetchVideos(query);
    }
});
function fetchVideos(query) {
    fetch(`${url}&maxResults=5&q=${query}`)
        .then(response => response.json())
        .then(data => {
            displayVideos(data.items);
        })
        .catch(error => console.error('Error fetching videos:', error));
}
function displayVideos(videos) {
    const recommendationsContainer = document.getElementById('recommendations-container');
    recommendationsContainer.innerHTML = '';
    videos.forEach(video => {
        const videoId = video.id.videoId;
        const videoTitle = video.snippet.title;
        const videoThumbnail = video.snippet.thumbnails.medium.url;
        const recommendation = document.createElement('div');
        recommendation.className = 'recommendation';
        recommendation.innerHTML = `
            <img src="${videoThumbnail}" alt="${videoTitle}">
            <p>${videoTitle}</p>
        `;
        recommendation.addEventListener('click', () => playVideo(videoId));
        recommendationsContainer.appendChild(recommendation);
    });
    if (videos.length > 0) {
        playVideo(videos[0].id.videoId);
    }
}

function playVideo(videoId) {
    currentVideoId = videoId;
    player.loadVideoById(videoId);
}
document.getElementById('play-pause').addEventListener('click', () => {
    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
});

document.getElementById('add-to-playlist').addEventListener('click', () => {
    if (currentVideoId) {
        const playlist = document.getElementById('playlist');
        const videoTitle = document.querySelector('.recommendation img').alt; 
        const videoUrl = `https://www.youtube.com/watch?v=${currentVideoId}`; 

        const li = document.createElement('li');
        li.textContent = videoTitle;

        const link = document.createElement('a');
        link.href = videoUrl;
        link.target = '_blank';
        link.textContent = ' Watch Video';

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '❌';
        deleteButton.style.marginLeft = '10px';
        deleteButton.style.color = 'red';
        deleteButton.style.cursor = 'pointer';

        deleteButton.addEventListener('click', () => {
            playlist.removeChild(li);
        });

        li.appendChild(link);
        li.appendChild(deleteButton);
        playlist.appendChild(li);
    }
});
