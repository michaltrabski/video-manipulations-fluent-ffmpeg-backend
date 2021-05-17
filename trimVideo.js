const ffmpeg = require("fluent-ffmpeg");

const trimVideo = (output, video, startSecond, drationSeconds, callback) => {
  ffmpeg.ffprobe(video, (err, metaData) => {
    if (err) return console.log("error!", err);
    const { duration } = metaData.format;
    console.log("duration", duration);

    const start = Date.now();
    ffmpeg()
      .input(video)
      .inputOptions([`-ss ${startSecond}`])
      .outputOptions([`-t ${drationSeconds}`])
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
      .run();
  });
};

module.exports = { trimVideo };
