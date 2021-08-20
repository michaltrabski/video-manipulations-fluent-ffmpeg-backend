const fs = require("fs");
const path = require("path");
const open = require("open");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const ffmpeg = require("fluent-ffmpeg");
const { createImage } = require("./createImage");
const { videoWithText } = require("./videoWithText");
const { getFrames } = require("./getFrames");
const { getVideos, trimVideos, mergeVideos } = require("./utils/utils");

(async () => {
  // await open("https://edit-video.netlify.app/");
})();

const videosFolder = path.resolve(__dirname, "videos");
const tempVideosFolder = path.resolve(__dirname, "videos", "temp");
const resultVideoFolder = path.resolve(__dirname, "videos", "result");

app.use(express.static("videos"));
app.use(bodyParser.json());
app.use(cors());

app.get("/", function (req, res) {
  const videos = [];
  fs.readdir(videosFolder, (err, files) => {
    files.forEach((file) => file.includes(".mp4") && videos.push(file));
    res.send({ videos });
  });
});

app.post("/", function (req, res) {
  // console.log("req =>", req.body);
  res.send(req.body);
  produceVideo(req.body);
});

const produceVideo = async (videos) => {
  console.log("1 ", videos);
  try {
    const trimedVideos = await trimVideos(videosFolder, videos);
    console.log("2 ", trimedVideos);

    const mergedVideoName = "xxxxxxxxxxxxxxxxxxxx.mp4";
    await mergeVideos(
      tempVideosFolder,
      resultVideoFolder,
      trimedVideos,
      mergedVideoName
    );
    console.log("Merged All Videos =>", mergedVideoName);
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
};

// PORT
app.listen(process.env.PORT || 3000, () => {});
