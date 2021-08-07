import { get, RequestOptions } from "https";
import fs from "fs";

export function downloadStarterMain() {
  return downloadFromURL(`https://github.com/FelixTellmann/shopify/archive/master.zip`);
}

function downloadFromURL(url: string, headers: RequestOptions = {}): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    get(url, headers, res => {
      console.log(res, url);
      if (res.statusCode === 302) {
        downloadFromURL(res.headers.location).then(resolve, reject);
      } else {
        const data: any[] = [];

        res.on("data", chunk => data.push(chunk));
        res.on("end", () => {
          resolve(Buffer.concat(data));
        });
        res.on("error", reject);
      }
    });
  });
}

export function createDir(folder: string) {
  return new Promise<void>(resolve => {
    const exist: boolean = fs.existsSync(folder);
    if (!exist) {
      fs.mkdirSync(folder);
    }

    resolve();
  });
}
