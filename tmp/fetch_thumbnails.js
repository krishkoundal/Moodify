const fs = require('fs');
const yts = require('yt-search');

const songs = [
  { id: '1', title: 'Midnight Dreams', artist: 'Luna Wave', album: 'Nocturnal', duration: '3:42', color: '#667eea', language: 'English' },
  { id: '2', title: 'Neon Lights', artist: 'Synthwave Kids', album: 'Electric', duration: '4:15', color: '#f5576c', language: 'English' },
  { id: '3', title: 'Ocean Breeze', artist: 'Calm Shores', album: 'Serenity', duration: '3:58', color: '#4facfe', language: 'English' },
  { id: '4', title: 'Rise Up', artist: 'Phoenix Rising', album: 'Ascend', duration: '3:30', color: '#43e97b', language: 'English' },
  { id: '5', title: 'Tum Hi Ho', artist: 'Arijit Singh', album: 'Aashiqui 2', duration: '4:22', color: '#fa709a', language: 'Hindi' },
  { id: '6', title: 'Kesariya', artist: 'Arijit Singh', album: 'Brahmastra', duration: '4:28', color: '#a18cd1', language: 'Hindi' },
  { id: '7', title: 'Apna Bana Le', artist: 'Arijit Singh', album: 'Bhediya', duration: '3:24', color: '#d57eeb', language: 'Hindi' },
  { id: '8', title: 'Pasoori', artist: 'Ali Sethi', album: 'Coke Studio', duration: '3:44', color: '#8ec5fc', language: 'Punjabi' },
  { id: '9', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: '3:20', color: '#667eea', language: 'English' },
  { id: '10', title: 'Stay', artist: 'The Kid LAROI', album: 'F*CK LOVE', duration: '2:21', color: '#f5576c', language: 'English' },
  { id: '11', title: 'Raatan Lambiyan', artist: 'Jubin Nautiyal', album: 'Shershaah', duration: '3:50', color: '#4facfe', language: 'Hindi' },
  { id: '12', title: 'Chaleya', artist: 'Anirudh Ravichander', album: 'Jawan', duration: '3:20', color: '#43e97b', language: 'Hindi' },
  { id: '13', title: 'Despacito', artist: 'Luis Fonsi', album: 'Vida', duration: '3:48', color: '#fa709a', language: 'Spanish' },
  { id: '14', title: 'Mi Gente', artist: 'J Balvin', album: 'Vibras', duration: '3:05', color: '#a18cd1', language: 'Spanish' },
  { id: '15', title: 'Excuses', artist: 'AP Dhillon', album: 'Hidden Gems', duration: '2:56', color: '#d57eeb', language: 'Punjabi' },
  { id: '16', title: 'Brown Munde', artist: 'AP Dhillon', album: 'Brown Munde', duration: '4:27', color: '#8ec5fc', language: 'Punjabi' },
  { id: '17', title: 'Arabic Kuthu', artist: 'Anirudh Ravichander', album: 'Beast', duration: '4:40', color: '#667eea', language: 'Tamil' },
  { id: '18', title: 'Butta Bomma', artist: 'Armaan Malik', album: 'AVPL', duration: '3:17', color: '#f5576c', language: 'Telugu' },
  { id: '19', title: 'Dynamite', artist: 'BTS', album: 'BE', duration: '3:19', color: '#4facfe', language: 'Korean' },
  { id: '20', title: 'La Vie En Rose', artist: 'Édith Piaf', album: 'Classic', duration: '3:05', color: '#43e97b', language: 'French' },
  { id: '21', title: 'Gypsy', artist: 'G.D. Kaur', album: 'Haryanvi Hits', duration: '3:10', color: '#fa709a', language: 'Haryanvi' },
  { id: '22', title: '52 Gaj Ka Daman', artist: 'Renuka Panwar', album: 'Haryanvi Hits', duration: '4:05', color: '#a18cd1', language: 'Haryanvi' },
];

async function run() {
  const result = [];
  for (const song of songs) {
    try {
      const r = await yts(`${song.title} ${song.artist} song`);
      if (r.videos.length > 0) {
        song.cover = r.videos[0].thumbnail;
        song.url = r.videos[0].url;
      } else {
        song.cover = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      }
    } catch (err) {
      song.cover = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    result.push(song);
    console.log(`Fetched ${song.title}`);
  }
  
  fs.writeFileSync('./tmp/fetched_songs.json', JSON.stringify(result, null, 2));
  console.log("Done fetching thumbnails!");
}

run();
