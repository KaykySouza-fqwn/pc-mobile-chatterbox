const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
const {statSync} = require('node:fs');

const path = 'out/encontro.mp4';
const probe = JSON.parse(execFileSync('ffprobe', [
  '-v', 'error', '-select_streams', 'v:0', '-count_frames',
  '-show_entries', 'stream=codec_name,width,height,r_frame_rate,nb_read_frames,duration',
  '-of', 'json', path,
], {encoding: 'utf8'}));

const video = probe.streams[0];
assert.equal(video.codec_name, 'h264');
assert.equal(video.width, 720);
assert.equal(video.height, 1280);
assert.equal(video.r_frame_rate, '24/1');
assert.equal(Number(video.nb_read_frames), 240);
assert.equal(Number(video.duration), 10);
const bytes = statSync(path).size;
assert.ok(bytes <= 15 * 1024 * 1024, 'MP4 ultrapassou o limite de 15 MiB');
console.log(JSON.stringify({...video, bytes}, null, 2));
