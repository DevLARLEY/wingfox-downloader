const fs = require('fs')
const path = require('path');
const { execSync } = require('child_process');

/*
WingFox WASM Decrytor
Author: github.com/DevLARLEY
For poly-wasm-player.js build '2024-1-22 14:53:22'
*/

let videoQueue = [];
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

  const { muxer, events } = require("./demuxer");
  const lib = require('./lib_player_1');

  let counter = 0;
  lib.onRuntimeInitialized = function(){
    console.log("[LOG]", "Loaded lib_player");

    a = lib.addFunction(
      (
        function (a, o, s, u, l, c, h, f, d) {
          var y = lib.HEAPU8.subarray(a, a + u * f);
          var v = lib.HEAPU8.subarray(o, o + l * f / 2);
          var g = lib.HEAPU8.subarray(s, s + c * f / 2);

          width = h;
            height = f;
            ptsValues.push(d / 90);

            writeYUVFile(y, v, g, f, h, path.join("frames", `frame_${counter}.yuv`));
            counter++;
        }
      ),
      'viiiiiiiii'
    );

    console.log("[LOG]", "Opening decoder...");
    lib._openDecoder(0, a, 1);

    o = function (e) {
      var t, n, r, i;
      for ( e = e.substr(1), t = '', n = 0; n < e.length; n++) {
        r = e.charAt(n), t += - 1 == (i = 'lpmkenjibhuvgycftxdrzsoawq0126783459'.indexOf(r)) ? r : 'abcdofghijklnmepqrstuvwxyz0123456789'.charAt(i);
      }
      return t
    }(token.split('-').pop())

    s = new Uint8Array(
      function (e) {
        var t = [], n = 0;
        for (e = encodeURI(e); n < e.length; ) {
          var r = e.charCodeAt(n++);
          37 === r ? (t.push(parseInt(e.substr(n, 2), 16)), n += 2) : t.push(r)
        }
        return t
      }(o)
    )

    //token
    console.log("[LOG]", "Setting token...");
    u = lib._malloc(s.length);
    lib.HEAPU8.set(s, u);
    var l = s.byteLength;

    //key
    console.log("[LOG]", "Setting key...");
    c = Uint8Array.from(key.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
    h = lib._malloc(c.length);
    lib.HEAPU8.set(c, h);
    var f = c.byteLength;

    //data
    console.log("[LOG]", "Setting data...");
    d = new Uint8Array(fs.readFileSync(input, null));
    p = d.byteLength;
    y = lib._malloc(p);
    lib.HEAPU8.set(d, y);

    //iv
    console.log("[LOG]", "Setting iv...");
    var v = lib._malloc(16);
    lib.HEAPU8.set(Uint8Array.from(iv.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))), v);
    lib['' + o] = l; 

    console.log("[LOG]", "Decryption arguments:", f, parseInt(mh), l, parseInt(index));
    var g = lib._get(y, v, p, h, f, parseInt(mh), u, l, parseInt(index));
    m = lib.HEAPU8.subarray(g, g + p - p % 188);
    lib._free(u);
    lib._free(h);
    lib._free(y);
    lib._free(v);
    
    events.on("DONE", (data) => {
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

      console.log("[LOG]", "Decoding fragments...");
      videoQueue.forEach(arr => {
        const d = arr.pes;
        var n = d.data_byte.length;
        var r = lib._malloc(n);
        lib.HEAPU8.set(d.data_byte, r);
        lib._decodeData(r, n, d.PTS);
        lib._free(r);
      });

      if(ptsValues.length > 1){
        console.log("[LOG]", "Saving audio...");
        let audio = new Uint8Array(audioLength);
        var audioOffset = 0;
        audioQueue.forEach(arr => {
          audio.set(arr, audioOffset);
          audioOffset += arr.length;
        });
        fs.writeFileSync(`fragment_${index}.aac`, audio);

        console.log("[LOG]", "Muxing yuv frames...");
        execSync(`ffmpeg -hide_banner -loglevel error -y -f image2 -c:v rawvideo -r ${Math.round(calculateFPS(ptsValues))} -pixel_format yuv420p -video_size ${width}x${height} -i frames/frame_%d.yuv fragment_${index}.mp4`);

        console.log("[LOG]", "Muxing video and audio...");
        execSync(`ffmpeg -hide_banner -loglevel error -y -i fragment_${index}.mp4 -i fragment_${index}.aac -codec copy ${output}`);
      }else{
        console.log("[LOG]", "Not enough frames, skipping fragment");
      }

      console.log("[LOG]", "Cleaning up...");
      setTimeout(() => {
        fs.unlink(`fragment_${index}.aac`, (err) => {});
        fs.unlink(`fragment_${index}.mp4`, (err) => {});
        fs.rm("frames", { recursive: true }, (err) => {
          if (err) throw err;
        });
      }, 100);

      console.log("[LOG]", `Fragment saved to: ${output}`);
    });

    events.on("DEMUX_DATA", (data) => {
      switch (data.stream_type) {
        case 27:
        case 36:
          videoQueue.push(data);
          break;
        case 3:
        case 15:
        case 17:
          let audioData = data.pes.data_byte;
          audioQueue.push(audioData);
          audioLength += audioData.length;
      }
    });

    console.log("[LOG]", "Starting demuxer...");
    demuxer = new muxer({
      enableWorker: !1,
      debug: !1,
      onlyDemuxElementary: !0
    })

    console.log("[LOG]", "Loading data...");
    demuxer.push(m, {
      done: !0
    })
  }
}

const args = process.argv.slice(2);

if (args.length >= 7) {
  decrypt(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
} else {
  let usage = (`
WingFox WASM Decrytor
Author: github.com/DevLARLEY
For poly-wasm-player.js build '2024-1-22 14:53:22'

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
