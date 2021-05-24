const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const { mergeVideos } = require("./mergeVideos");
const { createImage } = require("./createImage");
const { videoWithText } = require("./videoWithText");
const { getFrames } = require("./getFrames");
const {
  speedUpVideo,
  trimVideo,
  readFileDescription,
  getVideos,
  trimVideos,
} = require("./utils/utils");
var path = require("path");

const folder = path.resolve("videos");
const videos = [];
let settings = {};

(async function () {
  const videos = await getVideos(folder);
  const trimedVideos = await trimVideos(folder, videos);
  console.log(trimedVideos);

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
