# WingFox Downloader
A hooked version of the lib_player.js, that allows for YUV frame extraction. \
Only tested on free videos.

## Requirements
+ [Python 3.12](https://www.python.org/)
+ [NodeJS](https://nodejs.org/)
+ [ffmpeg](https://ffmpeg.org/)

## Installation
+ Install the `requirements.txt` file

## Protection Levels
Videos have to be either decrypted using AES or the built-in WASM decrypter.
WASM will be used if the key is 32 bytes in length and AES when it's 16 bytes in length. \
If a video protected using AES, then it's highly likely that the headers of each video fragment are also encrypted using AES.
Big thanks to Novia for posting [this](https://forum.videohelp.com/attachments/80815-1721376096/QQ%E6%88%AA%E5%9B%BE20240719160116.png).

There are also two different versions of lib_players. A normal one and one called 'next'. 
The only difference is that the 'next' version also includes the demuxer in WASM, so I had to copy over the JavaScript implementation of the demuxer for the normal version, hence the file called `demuxer.js`.


## main.py
Based on [https://github.com/gyozaaaa/the-fox-that-drank-redbull/blob/master/wingfox.py](https://github.com/gyozaaaa/the-fox-that-drank-redbull/blob/master/wingfox.py) \
Usage:
```ruby
usage: WingFox Downloader [-h] --id ID --cookie COOKIE [--output OUTPUT] [--subtitles] [--debug]

Author: github.com/DevLARLEY Credits: github.com/gyozaaaa

options:
  -h, --help       show this help message and exit
  --id ID          WingFox Video ID Example: wingfox.com/p/<course_id>/<video_id> Shall be obtained from the 'get_video_url' request if not present in the URL
  --cookie COOKIE  WingFox yiihuu_s_c_d/PHPSESSID Cookie
  --output OUTPUT  Output file name
  --subtitles      Save subtitles
  --debug, --d     Print debug information
```

Combines all steps mentioned here to download a video based on a video_id.


## decrypt_1.js / decrypt_2.js
These scripts hook the lib_player library which contains the WASM decrypter. 
They are able to decrypt a single fragment of the manifest.

Their usage:
````ruby
Usage: node decrypt.js <input_fragment> <output_fragment> <key> <iv> <token> <mh/seed_const> <fragment_index>
- input_fragment: Input fragment name
- output_fragment: Output fragment name
- key: 32 byte key
- iv: 16 byte iv
- token: Video token, Example: aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee-ff
- seed_const: Video seed, Example: 130
- fragment_index: Index of fragment in manifest, starting at 0
````

+ Key: Obtained by appending /playsafe/v12/ or /playsafe/v13/ depending on the lib_player version to the Key URI path inside the manifest
+ IV: Contained in the manifest
+ Token: Obtained from this endpoint: `https://www.wingfox.com/polyv/polyv_get_token.php?video_id={video_id}`
+ Seed: Obtained from the JSON metadata endpoint at: `https://player.polyv.net/secure/{vid}.json` \

See `main.py` for more info.

## N_m3u8DL-RE-WingFox
A modified version of N_m3u8DL-RE to download (and decrypt, if needed) the manifest.
