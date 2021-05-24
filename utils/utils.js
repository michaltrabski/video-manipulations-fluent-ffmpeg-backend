const ffmpeg = require("fluent-ffmpeg");
const { resolve } = require("path");
const path = require("path");
const fs = require("fs");

const trimVideos = async (folder, videos) => {
  const trimedVideos = [];
  for (const video of videos) {
    const trimedVideo = await trimVideo(folder, video);
    trimedVideos.push(trimedVideo);
  }
  return trimedVideos;
};

const trimVideo = async (folder, video) => {
  return new Promise((resolve, reject) => {
    const { videoName, order, start, end } = video;

    const durationSeconds = end - start;
    // console.log(videoName, order, start, end, durationSeconds);

    const fileInput = path.resolve(folder, videoName);
    const trimedVideoName = `TRIMED-${order}.mp4`;
    const fileOutput = path.resolve(folder, trimedVideoName);
    // console.log(fileInput, fileOutput);

    ffmpeg.ffprobe(fileInput, (err, metaData) => {
      if (err) return console.log("error_2", err);
      // const { duration } = metaData.format;

      ffmpeg()
        .input(fileInput)
        .inputOptions([`-ss ${start}`])
        .outputOptions([`-t ${durationSeconds}`])
        // .noAudio()
        .output(fileOutput)
        .on("end", () => {
          console.log("done");
          resolve(trimedVideoName);
        })
        .on("error", (err) => {
          console.log("error!", err);
          reject();
        })
        .on("progress", (progress) =>
          console.log(Math.floor(progress.percent) + "%")
        )
        .size("500x?")
        .run();
    });
  });
};

const getVideos = (folder) => {
  return new Promise((resolve, reject) => {
    fs.readdir(folder, (err, fileInputs) => {
      if (err) reject("error_1");
      const videos = [];
      fileInputs.forEach((fileInput) => {
        if (fileInput[0] === "v" && fileInput.includes(".mp4")) {
          videos.push(readfileInputDescription(fileInput));
        }
      });
      console.log(videos);
      resolve(videos);
    });
  });
};

const readfileInputDescription = (videoName) => {
  const description = videoName.replace(".mp4", "").split(" ");
  const [order, start, end] = description;

  return { videoName, order, start, end };
};

const speedUpVideo = async (video, output, callback) => {
  const amountOfPngfileInputs = 60;

  try {
    await videoToPng(video, amountOfPngfileInputs);

    const shortVideos = await pngToVideo(amountOfPngfileInputs);
    console.log("shortVideos", shortVideos);
    mergeVideos([...shortVideos], output);
  } catch (err) {
    console.log(err);
  }
};

const mergeVideos = (videos, output) => {
  let mergedVideos = ffmpeg();
  videos.forEach((video) => {
    mergedVideos = mergedVideos.addInput(video);
  });

  mergedVideos
    .mergeTofileInput(output)
    .on("error", (err) => console.log("error1"))
    .on("end", () => console.log("Ended!"))
    .on("progress", (progress) =>
      console.log(Math.floor(progress.percent) + "%")
    );
};

const pngToVideo = async (amountOfPngfileInputs) => {
  const videoPromise = (i) => {
    const png = path.resolve("videos", `tn_${i}.png`);
    const video = path.resolve("videos", `tn_${i}.mp4`);

    return new Promise((resolve, reject) => {
      ffmpeg(png)
        .loop(0.06)
        .output(video)
        .on("start", () => console.log(`video${i}`))
        .on("error", (error) => {
          console.log(error, png, video);
          reject("err1");
        })
        .on("end", () => resolve(video))
        .run();
    });
  };

  const shortVideos = [];
  const arr = Array.from({ length: amountOfPngfileInputs }, (_, i) => i + 1);
  console.log(arr);
  for (i of arr) {
    const shortVideo = await videoPromise(i);
    shortVideos.push(shortVideo);
  }

  // const all = [];
  // for (i = 1; i <= amountOfPngfileInputs; i++) {
  //   all.push(videoPromise(i));
  // }

  // const shortVideos = await Promise.all(all);
  return shortVideos;
};

const videoToPng = (video, amountOfPngfileInputs) => {
  return new Promise((resolve, reject) => {
    ffmpeg(video)
      .on("fileInputnames", (fileInputnames) =>
        console.log(fileInputnames.join(", "))
      )
      .on("end", () => resolve("videoToPng DONE"))
      .on("error", () => reject("err2"))
      .screenshots({
        count: amountOfPngfileInputs,
        folder: path.dirname(video),
        size: "650x?",
      });
  });
};

module.exports = {
  speedUpVideo,
  mergeVideos,
  readfileInputDescription,
  getVideos,
  trimVideos,
  trimVideo,
};
