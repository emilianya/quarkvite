export default function nameToMime(filename) {
    let fileNameParts = filename.split(".")
    let fileNameExtension = fileNameParts[fileNameParts.length - 1]
    switch (fileNameExtension) {
        case "png":
            return "image/png"
        default:
            return "application/octet-stream"
    }
}