// noinspection all

import AdmZip from "adm-zip"

let zip = new AdmZip();

zip.addLocalFolder("src/_nyafile")

zip.writeZip("public/default.nya")

console.log(`Created default.nya successfully`);