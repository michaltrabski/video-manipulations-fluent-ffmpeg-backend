const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const { createImage } = require("./createImage");
const { videoWithText } = require("./videoWithText");
const { getFrames } = require("./getFrames");
const { getVideos, trimVideos, mergeVideos } = require("./utils/utils");
var path = require("path");

const folder = path.resolve("videos");

(async function () {
  try {
    const videos = await getVideos(folder);
    // const trimedVideos = await trimVideos(folder, videos);

    // const gotowe = await mergeVideos(folder, trimedVideos);
    // console.log("gotowe", gotowe);
  } catch (err) {
    console.log("error_123", err);
  }

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
