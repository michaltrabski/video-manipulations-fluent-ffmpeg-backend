const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const { mergeVideos } = require("./mergeVideos");
const { createImage } = require("./createImage");
const { videoWithText } = require("./videoWithText");
const { getFrames } = require("./getFrames");
const { speedUpVideo, trimVideo } = require("./utils/utils");
var path = require("path");

const video = path.resolve("videos", "short.mp4");
const videoOutput = path.resolve("videos", "wynik.mp4");
// console.log("video", video);
speedUpVideo(video, videoOutput, () => {
  console.log("GOTOWE speedUpVideo");
});

// getFrames("long.mp4");

// trimVideo("short.mp4", "usun.mp4", 0, 1, () => {});

const input1 = "./app/video1-input";
const videos = [];
let settings = {};

(async function () {
  // fs.readdir(input1, (err, files) => {
  //   if (err) console.log("err1");
  //   files.forEach((file) => {
  //     if (file.includes(".mp4")) videos.push(file);
  //     if (file === "settings.json") {
  //       const data = fs.readFileSync(input1 + "/settings.json", {
  //         encoding: "utf8",
  //       });
  //       settings = { ...JSON.parse(data) };
  //     }
  //   });
  //   // console.log(videos, settings);
  // });
  // await createImage({
  //   name: "text1.png",
  //   text: "witam",
  //   leftPosition: 50,
  //   topPositon: 100,
  // });
  // await createImage({
  //   name: "text2.png",
  //   text: "Czesc",
  //   leftPosition: 50,
  //   topPositon: 100,
  // });
  // videoWithText({ name: "aaaaaaaaaaa.mp4" });
})();

// trimVideo(video,output,  startSecond, stopSecond, () => {
//   mergeVideos(output, videos);
// });
