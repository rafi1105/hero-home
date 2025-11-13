// encode.js
const fs = require("fs");
const key = fs.readFileSync("./herohome-e9276-firebase-adminsdk-fbsvc-a4fa428247.json", "utf8");
const base64 = Buffer.from(key).toString("base64");
console.log(base64);