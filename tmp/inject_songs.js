const fs = require('fs');
const content = fs.readFileSync('src/lib/mockData.ts', 'utf8');
const newSongs = fs.readFileSync('tmp/fetched_songs.json', 'utf8');

const regex = /export const songs: Song\[\] = \[[\s\S]*?\];/;
const replacement = `export const songs: Song[] = ${newSongs};`;
const newContent = content.replace(regex, replacement);
fs.writeFileSync('src/lib/mockData.ts', newContent);
console.log('Successfully injected real thumbnails into mockData.ts');
