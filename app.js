const fs = require("fs-extra");
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
const { videoToPng, trimVideos, mergeVideos, random } = require("./utils/utils");

// create folder for videos - put there mp4 files
const VIDEOS = "videos";
fs.ensureDirSync(path.resolve(__dirname, VIDEOS));

const G = path.resolve("G:", "YOUTUBE", "Buschcraft", "1) 27.09.2021 buschcraft nad odrą", "garmin");
const videosFolder = false ? G : path.resolve(__dirname, VIDEOS);

app.use(express.static(videosFolder));
app.use(bodyParser.json());
app.use(cors());

app.get("/", function (req, res) {
  const videos = [];
  fs.readdir(videosFolder, (err, files) => {
    if (err) return console.log("err", err);

    for (const file of files.slice(0, 11)) {
      if (file.includes(".mp4") || file.includes(".MP4")) {
        console.log("file => ", file);
        videos.push(file);
      }
    }

    console.log("videos => ", { videos });
    res.send({ videos });
  });
});

app.post("/", function (req, res) {
  res.send(req.body);
  produceVideo(req.body);
});

const videosToMp3 = async (videos) => {};

const produceVideo = async (videos) => {
  const tempVideosFolder = path.resolve(__dirname, VIDEOS, "temp");
  const resultVideoFolder = path.resolve(__dirname, VIDEOS, "result", random());

  fs.ensureDirSync(tempVideosFolder);
  fs.ensureDirSync(resultVideoFolder);

  try {
    const trimedVideos = await trimVideos(videosFolder, videos);
    const mergedVideoName = `video.mp4`;
    await mergeVideos(tempVideosFolder, resultVideoFolder, trimedVideos, mergedVideoName);
    console.log("Merged All Videos =>", mergedVideoName);
    await videoToPng(path.resolve(resultVideoFolder, mergedVideoName), 3);
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
app.listen(process.env.PORT || 3000, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT || 3000}`);
});
