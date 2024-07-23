const fs = require('fs')
const path = require('path');
const { execSync } = require('child_process');

/*
WingFox WASM Decrytor
Author: github.com/DevLARLEY
For NEXT poly-wasm-player.js build '2024-1-23 15:25:30'
*/

let videoCounter = 0;
let audioLength = 0;
let audioQueue = [];

let width;
let height;
let ptsValues = [];

function calculateFPS(ptsValues) {
  const frameDurations = [];
  for (let i = 1; i < ptsValues.length; i++) {
    frameDurations.push(ptsValues[i] - ptsValues[i - 1]);
  }
  const avgFrameDuration = frameDurations.reduce((a, b) => a + b, 0) / frameDurations.length;
  const fps = 1000 / avgFrameDuration;
  return fps;
}

function writeYUVFile(yData, uData, vData, width, height, outputFilePath) {
  const yBuffer = Buffer.from(yData);
  const uBuffer = Buffer.from(uData);
  const vBuffer = Buffer.from(vData);
  const yuvBuffer = Buffer.concat([yBuffer, uBuffer, vBuffer]);
  fs.writeFileSync(outputFilePath, yuvBuffer);
}

function decrypt(input, output, key, iv, token, mh, index){
  console.log("[LOG]", "WingFox WASM Decrytor, by: github.com/DevLARLEY");

  const lib = require('./lib_player_2');
  
  lib.onRuntimeInitialized = function(){
    console.log("[LOG]", "Loaded NEXT lib_player");

    a = lib.addFunction((
        function (e, a, s, u, l, c, f, h, d) {
          var y = new Uint8Array(lib.HEAPU8.subarray(e, e + u * h));
          var v = new Uint8Array(lib.HEAPU8.subarray(a, a + l * h / 2));
          var g = new Uint8Array(lib.HEAPU8.subarray(s, s + c * h / 2));

          width = f;
          height = h;
          ptsValues.push(d / 90);

          writeYUVFile(y, v, g, f, h, path.join("frames", `frame_${videoCounter}.yuv`));
          videoCounter++;
        }
      ), 'viiiiiiiii'
    );
    s = lib.addFunction((
        function (e, t, r, i) {
          const audioData = new Uint8Array(lib.HEAPU8.subarray(e, e + t));
          audioQueue.push(audioData);
          audioLength += audioData.length;
        }
      ), 'viiii'
    );

    l = function (e) {
      var t = [],
      n = 0;
      for (e = encodeURI(e); n < e.length; ) {
        var r = e.charCodeAt(n++);
        37 === r ? (t.push(parseInt(e.substr(n, 2), 16)), n += 2) : t.push(r)
      }
      return t
    }

    fs.mkdir("frames", (err) => {
      if (err) {
        if (err.code !== 'EEXIST') {
          throw err
        } else {
          fs.readdir("frames", (err, files) => {
            if (err) throw err;
            for (const file of files) {
              fs.unlink(path.join("frames", file), (err) => {
                if (err) throw err;
              });
            }
          });
        }
      }
    });

    u = new Uint8Array(l(token));
    c = lib._malloc(u.length);
    lib.HEAPU8.set(u, c);
    console.log("[LOG]", "Opening decoder...");
    lib._openDecoder(a, s, 1, c, token.split('-').pop().length);
    lib._free(c);

    l = function (e) {
      var t = [], n = 0;
      for (e = encodeURI(e); n < e.length; ) {
        var r = e.charCodeAt(n++);
        37 === r ? (t.push(parseInt(e.substr(n, 2), 16)), n += 2) : t.push(r)
      }
      return t
    }
    s = function (e) {
      var t, n, r, i;
      for (e = e.substr(1), t = '', n = 0; n < e.length; n++) {
        r = e.charAt(n), t += - 1 == (i = 'lpmkenjibhuvgycftxdrzsoawq0126783459'.indexOf(r)) ? r : 'abcdofghijklnmepqrstuvwxyz0123456789'.charAt(i);
      }
      return t
    }(token.split('-').pop())

    //token
    console.log("[LOG]", "Setting token...");
    u = new Uint8Array(l(s));
    c = lib._malloc(u.length);
    lib.HEAPU8.set(u, c);
    var f = u.byteLength;

    //key
    console.log("[LOG]", "Setting key...");
    h = Uint8Array.from(key.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)))
    d = lib._malloc(h.length);
    lib.HEAPU8.set(h, d);
    var p = h.byteLength;

    //data
    console.log("[LOG]", "Setting data...");
    y = new Uint8Array(fs.readFileSync(input, null));
    v = y.byteLength;
    g = lib._malloc(v);
    lib.HEAPU8.set(y, g);

    //iv
    console.log("[LOG]", "Setting iv...");
    var m = lib._malloc(16);
    lib.HEAPU8.set(Uint8Array.from(iv.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))), m);
    lib['' + s] = f;

    //static?
    var version = 2;
    console.log("[LOG]", "Decryption arguments:", p, mh, f, parseInt(index), version);
    var k = lib._sendData(g, m, v, d, p, mh, c, f, parseInt(index), version);
    lib._free(c);
    lib._free(d);
    lib._free(g);
    lib._free(m);

    if (k == 0) {
        throw Error("Unable to decrypt fragment");
    }

    console.log("[LOG]", "Getting frames...");
    lib._getFrames(k);

    console.log("[LOG]", "Saving audio...");
    let audio = new Uint8Array(audioLength);
    var audioOffset = 0;
    audioQueue.forEach(arr => {
      audio.set(arr, audioOffset);
      audioOffset += arr.length;
    });
    fs.writeFileSync(`fragment_${index}.aac`, audio);

    console.log("[LOG]", "Muxing yuv frames...");
    execSync(`ffmpeg -hide_banner -loglevel error -y -f image2 -c:v rawvideo -r ${Math.round(calculateFPS(ptsValues))} -pixel_format yuv420p -video_size ${width}x${height} -i frames\\frame_%d.yuv fragment_${index}.mp4`);
  
    console.log("[LOG]", "Muxing video and audio...");
    execSync(`ffmpeg -hide_banner -loglevel error -y -i fragment_${index}.mp4 -i fragment_${index}.aac -codec copy ${output}`);

    console.log("[LOG]", "Cleaning up...");
    setTimeout(() => {
      fs.unlink(`fragment_${index}.aac`, (err) => {
        if (err) throw err;
      });
      fs.unlink(`fragment_${index}.mp4`, (err) => {
        if (err) throw err;
      });
      fs.rm("frames", { recursive: true }, (err) => {
        if (err) throw err;
      });
    }, 100);

    console.log("[LOG]", `Fragment saved to: ${output}`);
  }
}

const args = process.argv.slice(2);

if (args.length >= 7) {
  console.log(args);
  decrypt(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
} else {
  let usage = (`
WingFox WASM Decrytor
Author: github.com/DevLARLEY
For NEXT poly-wasm-player.js build '2024-1-22 14:53:22'

Usage: node ${path.basename(process.argv[1])} <input_fragment> <output_fragment> <key> <iv> <token> <mh/seed_const> <fragment_index>
- input_fragment: Input fragment name
- output_fragment: Output fragment name
- key: 32 byte key
- iv: 16 byte iv
- token: Video token, Example: aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee-ff
- seed_const: Video seed, Example: 130
- fragment_index: Index of fragment in manifest, starting at 0
  `);
  console.log(usage);
}