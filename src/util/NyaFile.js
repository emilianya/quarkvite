import JSZip from "jszip";
import nameToMime from "./extensionToMime.js";

export default class NyaFile {

    defaultFile;
    nyaFile;
    constructor () {
        if (NyaFile._instance) return NyaFile._instance;
        NyaFile._instance = this;
    }

    async load(nyaFileUrl = "https://lightquark.network/default.nya", isDefault = true) {
        let nyaFileResponse = await fetch(nyaFileUrl);
        let nyaFileBlob = await nyaFileResponse.blob();
        if (isDefault) {
            this.defaultFile = await JSZip.loadAsync(nyaFileBlob);
        } else {
            this.nyaFile = await JSZip.loadAsync(nyaFileBlob)
        }
    }

    async getFile(filePath) {
        // TODO: multi file logic
        let fileNameRegex = new RegExp(`${filePath}\\..+`)
        if (!this.nyaFile) return await this.getDefaultFile(filePath)
        let searchResults = this.nyaFile.file(fileNameRegex)
        if (searchResults.length === 0) return this.getDefaultFile(filePath)
        return searchResults[0]
    }

    async getDefaultFile(filePath) {
        // TODO: multi file logic
        let fileNameRegex = new RegExp(`${filePath}\\..+`)
        return this.defaultFile.file(fileNameRegex)[0]
    }

    async getImageAssetDataUrl(imagePath) {
        let imageFile = await this.getFile(imagePath)
        let imageBase64 = await imageFile.async("base64");
        return `data:${nameToMime(imageFile.name)};base64,${imageBase64}`
    }
}