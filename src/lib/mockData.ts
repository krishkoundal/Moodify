export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
  color: string;
  url?: string;
  language?: 'Hindi' | 'English' | 'Punjabi' | 'Spanish' | 'Tamil' | 'Telugu' | 'Kannada' | 'Malayalam' | 'Bengali' | 'Marathi' | 'Gujarati' | 'Urdu' | 'Bhojpuri' | 'Korean' | 'Japanese' | 'French' | 'Haryanvi';
}


export interface Playlist {
  id: string;
  name: string;
  description: string;
  cover: string;
  songs: Song[];
  gradient: string;
}

export interface MoodPhase {
  name: string;
  emoji: string;
  color: string;
  songs: Song[];
}

export interface StoryFlowData {
  mood: string;
  phases: MoodPhase[];
}

export interface MoodEntry {
  date: string;
  mood: string;
  score: number;
  time: string;
}

export interface Insight {
  text: string;
  emoji: string;
  color: string;
}

export const moods = [
  { name: 'Happy', emoji: '😊', color: '#facc15', gradient: 'from-yellow-500 to-orange-500' },
  { name: 'Sad', emoji: '😢', color: '#3b82f6', gradient: 'from-blue-500 to-indigo-600' },
  { name: 'Angry', emoji: '😡', color: '#ef4444', gradient: 'from-red-500 to-rose-600' },
  { name: 'Calm', emoji: '😌', color: '#06b6d4', gradient: 'from-cyan-400 to-teal-500' },
  { name: 'Energetic', emoji: '⚡', color: '#a855f7', gradient: 'from-purple-500 to-pink-500' },
];

const coverColors = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
  'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
];

export const songs: Song[] = [
  {
    "id": "1",
    "title": "Midnight Dreams",
    "artist": "Luna Wave",
    "album": "Nocturnal",
    "duration": "3:42",
    "color": "#667eea",
    "language": "English",
    "cover": "https://i.ytimg.com/vi/h09UcgImwrE/hq720.jpg",
    "url": "https://youtube.com/watch?v=h09UcgImwrE"
  },
  {
    "id": "2",
    "title": "Neon Lights",
    "artist": "Synthwave Kids",
    "album": "Electric",
    "duration": "4:15",
    "color": "#f5576c",
    "language": "English",
    "cover": "https://i.ytimg.com/vi/rOZiTTfkzUs/hq720.jpg",
    "url": "https://youtube.com/watch?v=rOZiTTfkzUs"
  },
  {
    "id": "3",
    "title": "Ocean Breeze",
    "artist": "Calm Shores",
    "album": "Serenity",
    "duration": "3:58",
    "color": "#4facfe",
    "language": "English",
    "cover": "https://i.ytimg.com/vi/FOIjvHjK0Rw/hq720.jpg",
    "url": "https://youtube.com/watch?v=FOIjvHjK0Rw"
  },
  {
    "id": "4",
    "title": "Rise Up",
    "artist": "Phoenix Rising",
    "album": "Ascend",
    "duration": "3:30",
    "color": "#43e97b",
    "language": "English",
    "cover": "https://i.ytimg.com/vi/wQfe1fWFPm0/hq720.jpg",
    "url": "https://youtube.com/watch?v=wQfe1fWFPm0"
  },
  {
    "id": "5",
    "title": "Tum Hi Ho",
    "artist": "Arijit Singh",
    "album": "Aashiqui 2",
    "duration": "4:22",
    "color": "#fa709a",
    "language": "Hindi",
    "cover": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    "id": "6",
    "title": "Kesariya",
    "artist": "Arijit Singh",
    "album": "Brahmastra",
    "duration": "4:28",
    "color": "#a18cd1",
    "language": "Hindi",
    "cover": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    "id": "7",
    "title": "Apna Bana Le",
    "artist": "Arijit Singh",
    "album": "Bhediya",
    "duration": "3:24",
    "color": "#d57eeb",
    "language": "Hindi",
    "cover": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    "id": "8",
    "title": "Pasoori",
    "artist": "Ali Sethi",
    "album": "Coke Studio",
    "duration": "3:44",
    "color": "#8ec5fc",
    "language": "Punjabi",
    "cover": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    "id": "9",
    "title": "Blinding Lights",
    "artist": "The Weeknd",
    "album": "After Hours",
    "duration": "3:20",
    "color": "#667eea",
    "language": "English",
    "cover": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    "id": "10",
    "title": "Stay",
    "artist": "The Kid LAROI",
    "album": "F*CK LOVE",
    "duration": "2:21",
    "color": "#f5576c",
    "language": "English",
    "cover": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    "id": "11",
    "title": "Raatan Lambiyan",
    "artist": "Jubin Nautiyal",
    "album": "Shershaah",
    "duration": "3:50",
    "color": "#4facfe",
    "language": "Hindi",
    "cover": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    "id": "12",
    "title": "Chaleya",
    "artist": "Anirudh Ravichander",
    "album": "Jawan",
    "duration": "3:20",
    "color": "#43e97b",
    "language": "Hindi",
    "cover": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    "id": "13",
    "title": "Despacito",
    "artist": "Luis Fonsi",
    "album": "Vida",
    "duration": "3:48",
    "color": "#fa709a",
    "language": "Spanish",
    "cover": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    "id": "14",
    "title": "Mi Gente",
    "artist": "J Balvin",
    "album": "Vibras",
    "duration": "3:05",
    "color": "#a18cd1",
    "language": "Spanish",
    "cover": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    "id": "15",
    "title": "Excuses",
    "artist": "AP Dhillon",
    "album": "Hidden Gems",
    "duration": "2:56",
    "color": "#d57eeb",
    "language": "Punjabi",
    "cover": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    "id": "16",
    "title": "Brown Munde",
    "artist": "AP Dhillon",
    "album": "Brown Munde",
    "duration": "4:27",
    "color": "#8ec5fc",
    "language": "Punjabi",
    "cover": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    "id": "17",
    "title": "Arabic Kuthu",
    "artist": "Anirudh Ravichander",
    "album": "Beast",
    "duration": "4:40",
    "color": "#667eea",
    "language": "Tamil",
    "cover": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    "id": "18",
    "title": "Butta Bomma",
    "artist": "Armaan Malik",
    "album": "AVPL",
    "duration": "3:17",
    "color": "#f5576c",
    "language": "Telugu",
    "cover": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    "id": "19",
    "title": "Dynamite",
    "artist": "BTS",
    "album": "BE",
    "duration": "3:19",
    "color": "#4facfe",
    "language": "Korean",
    "cover": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    "id": "20",
    "title": "La Vie En Rose",
    "artist": "Édith Piaf",
    "album": "Classic",
    "duration": "3:05",
    "color": "#43e97b",
    "language": "French",
    "cover": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    "id": "21",
    "title": "Gypsy",
    "artist": "G.D. Kaur",
    "album": "Haryanvi Hits",
    "duration": "3:10",
    "color": "#fa709a",
    "language": "Haryanvi",
    "cover": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    "id": "22",
    "title": "52 Gaj Ka Daman",
    "artist": "Renuka Panwar",
    "album": "Haryanvi Hits",
    "duration": "4:05",
    "color": "#a18cd1",
    "language": "Haryanvi",
    "cover": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  }
];

export const playlists: Playlist[] = [
  {
    id: 'p1', name: 'Late Night Vibes', description: 'Smooth tracks for midnight sessions',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400', songs: songs.slice(0, 4), gradient: 'from-indigo-600 to-purple-700',
  },
  {
    id: 'p2', name: 'Feel Good Energy', description: 'Upbeat songs to boost your mood',
    cover: '/images/feel_good.png', songs: songs.slice(4, 8), gradient: 'from-emerald-500 to-cyan-500',
  },
  {
    id: 'p3', name: 'Chill & Focus', description: 'Lo-fi beats for deep concentration',
    cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400', songs: songs.slice(8, 12), gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'p4', name: 'Healing Melodies', description: 'Soothing music for the soul',
    cover: '/images/healing_melodies.png', songs: songs.slice(2, 6), gradient: 'from-sky-500 to-blue-600',
  },
  {
    id: 'p5', name: 'Power Workout', description: 'High energy tracks for the gym',
    cover: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400', songs: songs.slice(6, 10), gradient: 'from-rose-500 to-red-600',
  },
  {
    id: 'p6', name: 'Sunset Drive', description: 'Perfect playlist for a road trip',
    cover: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=400', songs: songs.slice(10, 14), gradient: 'from-amber-500 to-pink-500',
  },
];

export const storyFlows: Record<string, StoryFlowData> = {
  Happy: {
    mood: 'Happy',
    phases: [
      { name: 'Feel the Joy', emoji: '🌟', color: '#facc15', songs: [songs[3], songs[4], songs[6]] },
      { name: 'Dance Mode', emoji: '💃', color: '#f97316', songs: [songs[1], songs[9], songs[11]] },
      { name: 'Pure Bliss', emoji: '🎉', color: '#ec4899', songs: [songs[5], songs[7], songs[13]] },
    ],
  },
  Sad: {
    mood: 'Sad',
    phases: [
      { name: 'Let It Out', emoji: '💧', color: '#60a5fa', songs: [songs[10], songs[12], songs[7]] },
      { name: 'Healing', emoji: '🌿', color: '#34d399', songs: [songs[2], songs[14], songs[5]] },
      { name: 'Rise Again', emoji: '🌅', color: '#fbbf24', songs: [songs[3], songs[11], songs[4]] },
    ],
  },
  Angry: {
    mood: 'Angry',
    phases: [
      { name: 'Release', emoji: '🔥', color: '#ef4444', songs: [songs[13], songs[6], songs[1]] },
      { name: 'Cool Down', emoji: '❄️', color: '#38bdf8', songs: [songs[2], songs[14], songs[7]] },
      { name: 'Inner Peace', emoji: '🕊️', color: '#a78bfa', songs: [songs[5], songs[15], songs[8]] },
    ],
  },
  Calm: {
    mood: 'Calm',
    phases: [
      { name: 'Soft Start', emoji: '🌸', color: '#f9a8d4', songs: [songs[2], songs[7], songs[14]] },
      { name: 'Deep Focus', emoji: '🧘', color: '#818cf8', songs: [songs[0], songs[5], songs[15]] },
      { name: 'Drift Away', emoji: '☁️', color: '#67e8f9', songs: [songs[8], songs[10], songs[12]] },
    ],
  },
  Energetic: {
    mood: 'Energetic',
    phases: [
      { name: 'Warm Up', emoji: '🏃', color: '#f97316', songs: [songs[8], songs[1], songs[3]] },
      { name: 'Full Power', emoji: '⚡', color: '#a855f7', songs: [songs[6], songs[11], songs[13]] },
      { name: 'Victory Lap', emoji: '🏆', color: '#eab308', songs: [songs[4], songs[9], songs[15]] },
    ],
  },
};

export const moodHistory: MoodEntry[] = [
  { date: 'Mar 17', mood: 'Happy', score: 85, time: '10:30 AM' },
  { date: 'Mar 18', mood: 'Calm', score: 70, time: '2:15 PM' },
  { date: 'Mar 19', mood: 'Energetic', score: 90, time: '8:00 AM' },
  { date: 'Mar 19', mood: 'Sad', score: 40, time: '11:30 PM' },
  { date: 'Mar 20', mood: 'Sad', score: 35, time: '9:45 PM' },
  { date: 'Mar 21', mood: 'Calm', score: 65, time: '3:00 PM' },
  { date: 'Mar 21', mood: 'Happy', score: 80, time: '6:30 PM' },
  { date: 'Mar 22', mood: 'Energetic', score: 92, time: '7:00 AM' },
  { date: 'Mar 22', mood: 'Angry', score: 30, time: '10:00 PM' },
  { date: 'Mar 23', mood: 'Calm', score: 72, time: '4:00 PM' },
  { date: 'Mar 23', mood: 'Happy', score: 88, time: '7:30 PM' },
  { date: 'Mar 24', mood: 'Calm', score: 75, time: '2:45 PM' },
];

export const insights: Insight[] = [
  { text: 'You listen to sad music mostly at night.', emoji: '🌙', color: '#60a5fa' },
  { text: 'Your energy peaks in the morning hours.', emoji: '☀️', color: '#facc15' },
  { text: 'You prefer calm music during work hours.', emoji: '🧘', color: '#34d399' },
  { text: 'Your most active listening day is Saturday.', emoji: '📊', color: '#a855f7' },
];

export const genres = [
  { name: 'Pop', gradient: 'from-pink-500 to-rose-500', emoji: '🎤' },
  { name: 'Hip Hop', gradient: 'from-amber-500 to-orange-600', emoji: '🎧' },
  { name: 'Electronic', gradient: 'from-cyan-400 to-blue-500', emoji: '🎹' },
  { name: 'R&B', gradient: 'from-purple-500 to-indigo-600', emoji: '🎵' },
  { name: 'Rock', gradient: 'from-red-500 to-gray-700', emoji: '🎸' },
  { name: 'Lo-Fi', gradient: 'from-emerald-400 to-teal-600', emoji: '🌊' },
  { name: 'Jazz', gradient: 'from-yellow-600 to-amber-800', emoji: '🎷' },
  { name: 'Classical', gradient: 'from-slate-400 to-gray-600', emoji: '🎻' },
];

export const generatedLyrics = [
  "In the quiet of the night, I find my peace,",
  "Where the stars align and worries cease.",
  "A melody born from the soul within,",
  "A gentle rhythm where dreams begin.",
  "",
  "Through every storm, I'll find my way,",
  "With music guiding night and day.",
  "The notes they dance, the chords they sing,",
  "Of hope and love and everything.",
  "",
  "So let the music take the lead,",
  "Plant the sound, become the seed.",
  "In every beat, a story told,",
  "More precious than a heart of gold.",
];
