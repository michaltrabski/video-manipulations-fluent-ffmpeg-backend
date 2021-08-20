const ffmpeg = require("fluent-ffmpeg");
const { resolve } = require("path");
const path = require("path");
const fs = require("fs");
const slugify = require("slugify");

const makeSlug = (text) => {
  return slugify(text, {
    replacement: "-", // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: false, // convert to lower case, defaults to `false`
    strict: false, // strip special characters except replacement, defaults to `false`
    locale: "vi", // language code of the locale to use
  });
};

const mergeVideos = (
  folder,
  resultVideoFolder,
  videosToMerge,
  mergedVideoName
) => {
  return new Promise((resolve, reject) => {
    const videos = videosToMerge.map((videoName) =>
      path.resolve(folder, videoName)
    );
    console.log("3", videos);

    let mergedVideos = ffmpeg();
    videos.forEach((video) => {
      mergedVideos = mergedVideos.addInput(video);
    });

    const fileOutput = path.resolve(resultVideoFolder, mergedVideoName);

    console.log("4", fileOutput);

    mergedVideos
      .mergeToFile(fileOutput)
      .on("error", (err) => {
        console.log("error!", err);
        reject();
      })
      .on("end", () => {
        console.log("Ended!");
        resolve(mergedVideoName);
      })
      .on("progress", (progress) =>
        console.log(Math.floor(progress.percent) + "%")
      );
  });
};

const trimVideos = async (folder, videos) => {
  // console.log("folder", folder);
  const trimedVideos = [];
  for (const video of videos) {
    const trimedVideo = await trimVideo(folder, video);
    trimedVideos.push(trimedVideo);
  }
  return trimedVideos;
};

const trimVideo = async (folder, video) => {
  return new Promise((resolve, reject) => {
    const { id, name, trimStart, trimStop } = video;
    const durationSeconds = trimStop - trimStart;
    const fileInput = path.resolve(folder, name);
    const trimedVideoName = `TRIMED-${id}-${name}`;
    const fileOutput = path.resolve(folder, "temp", trimedVideoName);

    ffmpeg.ffprobe(fileInput, (err, metaData) => {
      if (err) return console.log("error_2", err);
      // const { duration } = metaData.format;

      ffmpeg()
        .input(fileInput)
        .inputOptions([`-ss ${trimStart}`])
        .outputOptions([`-t ${durationSeconds}`])
        .noAudio()
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
        // .size("1920x?")
        .size("100x?")
        .run();
    });
  });
};

const getVideos = (folder, htmlFolder) => {
  return new Promise((resolve, reject) => {
    fs.readdir(folder, (err, files) => {
      if (err) reject("error_1");
      const videos = [];
      files.forEach((file) => {
        if (file[0] === "v" && file.includes(".mp4")) {
          videos.push(readfileInputDescription(file));
        }
        // if (file.includes(".mp4")) {
        //   videos.push(readfileInputDescription(file));
        // }
      });
      console.log(videos, folder, htmlFolder);

      const dataOutput = path.resolve(htmlFolder, "data.json");
      fs.writeFile(dataOutput, JSON.stringify(videos), function (err) {
        if (err) return console.log("err_12314234234");
        resolve(videos);
      });
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
  readfileInputDescription,
  getVideos,
  trimVideos,
  trimVideo,
  mergeVideos,
  makeSlug,
};
