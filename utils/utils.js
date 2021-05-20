const ffmpeg = require("fluent-ffmpeg");
var path = require("path");

const speedUpVideo = async (video, output, callback) => {
  const amountOfPngFiles = 4;

  // get many png from mp4
  await videoToPng(video, amountOfPngFiles);

  const shortVideos = await pngToVideo(amountOfPngFiles);
  console.log("shortVideos", shortVideos);
  // convert each png to short mp4

  // mergeVideos(output, smallVideos);
};

const pngToVideo = async (amountOfPngFiles) => {
  const videoPromise = (i) => {
    const png = path.resolve("videos", `tn_${i}.png`);
    const video = path.resolve("videos", `tn_${i}.mp4`);

    return new Promise((resolve, reject) => {
      ffmpeg(png)
        .loop(0.5)
        .output(video)
        .on("start", () => console.log("start"))
        .on("error", (error) => reject("err"))
        .on("end", () => resolve(video))
        .run();
    });
  };

  const all = [];
  for (i = 1; i <= amountOfPngFiles; i++) {
    all.push(videoPromise(i));
  }

  const shortVideos = await Promise.all(all);
  return shortVideos;
};

const videoToPng = (video, amountOfPngFiles) => {
  return new Promise((resolve, reject) => {
    ffmpeg(video)
      .on("filenames", (filenames) => console.log(filenames.join(", ")))
      .on("end", () => resolve("videoToPng DONE"))
      .on("error", () => reject("videoToPng ERROR"))
      .screenshots({
        count: amountOfPngFiles,
        folder: path.dirname(video),
      });
  });
};

const mergeVideos = (_output, _videos) => {
  const output = _output;
  const videos = _videos.map((video) => `${video}`);
  console.log(output, videos);

  let mergedVideos = ffmpeg();
  videos.forEach((video) => {
    mergedVideos = mergedVideos.addInput(video);
  });

  mergedVideos
    .mergeToFile(output)
    .on("error", (err) => console.log("error!", err))
    .on("end", () => console.log("Ended!"))
    .on("progress", (progress) =>
      console.log(Math.floor(progress.percent) + "%")
    );
};

const trimVideo = (_video, _output, startSecond, stopSecond, callback) => {
  const video = "./videos/" + _video;
  const output = "./videos/" + _output;

  const durationSeconds = stopSecond - startSecond;

  ffmpeg.ffprobe(video, (err, metaData) => {
    if (err) return console.log("error!", err);
    const { duration } = metaData.format;
    console.log("duration", duration);

    const start = Date.now();
    ffmpeg()
      .input(video)
      .inputOptions([`-ss ${startSecond}`])
      .outputOptions([`-t ${durationSeconds}`])
      // .noAudio()
      .output(output)
      .on("end", () => {
        console.log("trimmed in: ", (Date.now() - start) / 1000, "seconds");
        callback();
      })
      .on("error", (err) => console.log("error!", err))
      .on("progress", (progress) =>
        console.log(Math.floor(progress.percent) + "%")
      )
      .withSize("320x?")
      .run();
  });
};

module.exports = { trimVideo, speedUpVideo, mergeVideos };
