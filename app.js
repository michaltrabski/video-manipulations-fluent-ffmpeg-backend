const fs = require("fs-extra");
const path = require("path");
const util = require("util");
const open = require("open");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const ffmpeg = require("fluent-ffmpeg");
const { createImage } = require("./createImage");
const { videoWithText } = require("./videoWithText");
const { getFrames } = require("./getFrames");
const { videoToPng, trimVideos, mergeVideos, random, normalizeProjectsSubfoldersNames, getVideoInfo } = require("./utils/utils");

const PORT = process.env.PORT || 5500;

// create folder for projects, there will be subfolders for each project
const VIDEO_PROJECTS = "projects";
const projectsDir = path.resolve(__dirname, VIDEO_PROJECTS);
fs.ensureDirSync(projectsDir);

// create subfolder (or subfolders) for each project and put there mp4 files
fs.ensureDirSync(path.resolve(VIDEO_PROJECTS, "example-project-name"));

//
normalizeProjectsSubfoldersNames(projectsDir);

const G = path.resolve("G:", "YOUTUBE", "Buschcraft", "1) 27.09.2021 buschcraft nad odrą", "garmin");
const videosFolder = false ? G : path.resolve(__dirname, VIDEO_PROJECTS);

// serve static files from videos folder and allow cors
app.use(express.static(videosFolder));
app.use(bodyParser.json());
app.use(cors());

// get data about all projects
// app.get("/sync", function (req, res) {
//   // find all projects
//   const projects = [];
//   fs.readdirSync(projectsDir).forEach((item) => {
//     const isItemDirectory = fs.lstatSync(path.resolve(projectsDir, item)).isDirectory();
//     if (isItemDirectory) {
//       projects.push({ name: item });
//     }
//   });

//   // find all videos in each project
//   projects.forEach((project) => {
//     const videosFolder = path.resolve(projectsDir, project.name);

//     const videos = [];

//     fs.readdirSync(videosFolder).forEach((item) => {
//       if (item.includes(".mp4") || item.includes(".MP4")) {
//         const videoPath = path.resolve(videosFolder, item);
//         const videoName = item;

//         //  const {duration} = await getVideoDuration(videoPath); // this is async - refactor needed

//         videos.push({ videoName, videoPath });
//       }
//     });

//     project.videos = videos;
//   });

//   res.send({ projects });
// });

app.get("/", async (req, res) => {
  try {
    const projects = [];

    const projectDirs = fs.readdirSync(projectsDir);

    await Promise.all(
      projectDirs.map(async (item) => {
        const isItemDirectory = fs.lstatSync(path.resolve(projectsDir, item)).isDirectory();

        if (isItemDirectory) {
          const project = { name: item };
          const videosFolder = path.resolve(projectsDir, project.name);

          const videoFiles = fs.readdirSync(videosFolder);

          project.videos = videoFiles
            .filter((item) => item.match(/\.(mp4|MP4)$/))
            .map(async (item) => {
              const videoPath = path.resolve(videosFolder, item);
              const videoName = item;

              const { duration, size } = await getVideoInfo(videoPath);

              return { videoName, videoPath, duration, size };
            });

          projects.push(project);
        }
      })
    );

    const updatedProjects = await Promise.all(
      projects.map(async (project) => {
        project.videos = await Promise.all(project.videos);
        return project;
      })
    );

    res.send({ projects: updatedProjects });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/", function (req, res) {
  res.send(req.body);
  produceVideo(req.body);
});

const videosToMp3 = async (videos) => {};

const produceVideo = async (videos) => {
  const tempVideosFolder = path.resolve(__dirname, VIDEO_PROJECTS, "temp");
  const resultVideoFolder = path.resolve(__dirname, VIDEO_PROJECTS, "result", random());

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
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
