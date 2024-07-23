import argparse
import base64
import glob
import hashlib
import json
import logging
import os
import shutil
import subprocess
from urllib.parse import urlparse, urlunparse, urlencode, parse_qsl

import m3u8
import requests
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad


def clean(*globs):
    for g in globs:
        if os.path.isdir(g):
            shutil.rmtree(g)
        else:
            for delete in glob.glob(g):
                os.remove(delete)


def get_absolute_paths(directory):
    for absolute, _, filenames in os.walk(directory):
        for filename in filenames:
            yield os.path.abspath(os.path.join(absolute, filename))


class WingFox:
    def __init__(
            self,
            video_id: str,
            cookie: str
    ):
        """
        WingFox Downloader
        Author: github.com/DevLARLEY
        """
        self.video_id = video_id
        self.cookie = cookie

    def get_video_vid(self) -> str | None:
        vid_request = requests.get(
            'https://api.wingfox.com/api/album/get_video_url',
            params={
                'play_video_id': self.video_id
            },
            cookies={
                'yiihuu_s_c_d': self.cookie
            }
        )

        if vid_request.status_code != 200:
            logging.error(f"Unable to request video_vid ({vid_request.status_code}): {vid_request.text}")
            exit(-1)

        return vid_request.json().get('data', {}).get('video_vid')

    @staticmethod
    def get_hls_seed_url(
            video_vid: str
    ) -> dict | None:
        video_request = requests.get(
            url=f"https://player.polyv.net/secure/{video_vid}.json"
        )

        if video_request.status_code != 200:
            logging.error(f"Unable to request video json ({video_request.status_code}): {video_request.text}")
            exit(-1)

        hashed = hashlib.md5(video_vid.encode('utf-8')).hexdigest()
        key, iv = hashed[:16].encode(), hashed[16:].encode()

        aes_cipher = AES.new(key, AES.MODE_CBC, iv=iv)
        decrypted = aes_cipher.decrypt(
            bytes.fromhex(video_request.json().get('body'))
        ).rstrip(b'\x0c')

        decrypted_json = json.loads(base64.b64decode(decrypted).decode())

        if decrypted_json.get("hls"):
            return decrypted_json

    @staticmethod
    def get_m3u8(
            body: dict
    ) -> str | None:
        hls_request = requests.get(
            url=body.get('hls')[0],
            params={
                'device': 'desktop',
            },
            headers={
                'Referer': 'https://www.wingfox.com/',
            }
        )

        if hls_request.status_code != 200:
            logging.error(f"Unable to request m3u8 data ({hls_request.status_code}): {hls_request.text}")
            exit(-1)

        enc_m3u8 = hls_request.json()['body']

        secret = f'NTQ1ZjhmY2QtMzk3OS00NWZhLTkxNjktYzk3NTlhNDNhNTQ4#{body.get('seed_const')}'
        iv = bytes([1, 1, 2, 3, 5, 8, 13, 21, 34, 21, 13, 8, 5, 3, 2, 1])

        if body.get('hlsPrivate') == 2:
            secret = f'OWtjN9xcDcc2cwXKxECpRgKw7piD4RwCdfOUlyNHFdSV0gHi={body.get('seed_const')}'
            iv = bytes([13, 22, 8, 12, 7, 6, 13, 1, 50, 11, 12, 8, 5, 16, 4, 1])

        aes_key = hashlib.md5(secret.encode()).hexdigest()[1:17].encode()

        cipher = AES.new(
            aes_key,
            AES.MODE_CBC,
            iv=iv
        )
        dec = cipher.decrypt(base64.b64decode(enc_m3u8))
        return unpad(dec, 16).decode()

    def get_key_token(self) -> str | None:
        token_request = requests.get(
            url="https://www.wingfox.com/polyv/polyv_get_token.php",
            params={
                'video_id': self.video_id
            },
            cookies={
                "yiihuu_s_c_d": self.cookie
            }
        )

        if token_request.status_code != 200:
            logging.error(f"Unable to request token ({token_request.status_code}): {token_request.text}")
            exit(-1)

        return token_request.text

    @staticmethod
    def _update_key(
            uri: str,
            token: str,
            version: int,
            hls_level: str
    ) -> str:
        parse_result = urlparse(uri)

        query = dict(parse_qsl(parse_result.query))
        query.update({
            "token": token
        })

        if hls_level == "app" or version == 2:
            path = f"/playsafe/v{version + 11}" + parse_result.path
            return urlunparse(
                # dangerous
                parse_result._replace(path=path, query=urlencode(query))
            )
        elif hls_level == "web":
            return urlunparse(
                # dangerous
                parse_result._replace(query=urlencode(query))
            )


    def implant_token(
            self,
            m3u8_data: str,
            token: str,
            version: int,
            hls_level: str
    ) -> str:
        parsed = m3u8.loads(m3u8_data)

        if keys := parsed.keys:
            for key in keys:
                if hls_level == "app" or version == 2:
                    key.uri, key.iv, key.method = "", "", ""
                elif hls_level == "web":
                    key.uri = self._update_key(
                        uri=key.uri,
                        token=token,
                        version=version,
                        hls_level=hls_level
                    )

        return parsed.dumps()

    @staticmethod
    def download(
            hls_level: str
    ):
        command = [
            "N_m3u8DL-RE-WingFox",
            m3u8_file,
            "--no-log",
            "--wingfox-decrypt",
            "1",
        ]
        if hls_level == "app" or version == 2:
            command.extend([
                "--skip-merge"
            ])

        subprocess.run(
            command,
            shell=False
        )

    def get_decrypt_info(
            self,
            m3u8_data: str,
            version: int,
            hls_level: str,
            token: str
    ) -> tuple[str, str, str]:
        parsed = m3u8.loads(m3u8_data)
        key = parsed.keys[0]
        key_request = requests.get(
            url=self._update_key(
                uri=key.uri,
                token=token,
                version=version,
                hls_level=hls_level
            )
        )

        if key_request.status_code != 200:
            logging.error(f"Unable to request key ({key_request.status_code}): {key_request.text}")
            exit(1)

        return (
            key_request.content.hex(),
            key.iv[2:],
            token
        )


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        prog="WingFox Downloader",
        description=(
            """
            Author: github.com/DevLARLEY
            Credits: github.com/gyozaaaa
            """
        )
    )
    parser.add_argument(
        "--id",
        type=int,
        help=(
            """
            WingFox Video ID 
            Example: wingfox.com/p/<course_id>/<video_id>
            Shell be obtained the 'get_video_url' request if not present in the URL
            """
        ),
        required=True
    )
    parser.add_argument(
        "--cookie",
        type=str,
        help="WingFox yiihuu_s_c_d/PHPSESSID Cookie",
        required=True
    )
    parser.add_argument(
        "--output",
        type=str,
        help="Output file name",
        required=False
    )
    parser.add_argument(
        "--debug", "--d",
        action="store_true",
        default=False,
        help="Print debug information",
        required=False
    )

    args = parser.parse_args()

    logging.basicConfig(format='[%(levelname)s]: %(message)s', level=logging.DEBUG if args.debug else logging.INFO)

    # TODO:
    #  download subtitles
    #  get name from json
    #    lib_players:
    #  https://player.polyv.net/resp/vod-player-drm/canary/lib_player.js
    #  https://player.polyv.net/resp/vod-player-drm/canary/next/lib_player.js

    dl = WingFox(
        video_id=args.id,
        cookie=args.cookie
    )

    output_name = f"{args.id}.mkv"
    if args.output:
        output_name = args.output

    vid = dl.get_video_vid()
    decrypted_body = dl.get_hls_seed_url(vid)

    print('seed', seed := decrypted_body.get('seed_const'))
    print('hlsLevel', hls_level := decrypted_body.get('hlsLevel'))
    print('hlsPrivate', version := decrypted_body.get('hlsPrivate'))

    manifest_data = dl.get_m3u8(decrypted_body)

    key_token = dl.get_key_token()
    modified_data = dl.implant_token(
        m3u8_data=manifest_data,
        token=key_token,
        version=version,
        hls_level=hls_level
    )

    m3u8_file = f'{args.id}.m3u8'
    with open(m3u8_file, 'w') as f:
        f.write(modified_data)

    dl.download(
        hls_level=hls_level
    )

    # TODO: throw error in test_normal.js
    if hls_level == "app" or version == 2:
        key, iv, token = dl.get_decrypt_info(
            m3u8_data=manifest_data,
            version=version,
            hls_level=hls_level,
            token=key_token
        )
        with open("filelist.txt", "w") as f:
            for idx, file in enumerate(get_absolute_paths(os.path.join(str(args.id), "0"))):
                if not file.endswith(".ts"):
                    continue

                logging.info(f"Decrypting fragment {idx}...")
                try:
                    # print([
                    #     "node", f"decrypt_{version}.js",
                    #     file, f"fragment_{idx}.mkv",
                    #     key, iv,
                    #     token, str(seed),
                    #     str(idx)
                    # ])
                    subprocess.check_output([
                        "node", f"decrypt_{version}.js",
                        file, f"fragment_{idx}.mkv",
                        key, iv,
                        token, str(seed),
                        str(idx)
                    ], shell=False)
                except Exception:
                    logging.error("Error while decrypting fragment")
                    clean("fragment_*.mkv", "filelist.txt", f"{args.id}.m3u8", str(args.id))
                    exit(1)

                f.write(f"file fragment_{idx}.mkv\n")

        logging.info("Muxing all segments...")
        subprocess.check_output([
            "ffmpeg", "-y", "-loglevel", "error",
            "-f", "concat",
            "-safe", "0",
            "-i", "filelist.txt",
            "-c", "copy",
            output_name
        ])

    clean("fragment_*.mkv", "filelist.txt", f"{args.id}.m3u8", str(args.id))
