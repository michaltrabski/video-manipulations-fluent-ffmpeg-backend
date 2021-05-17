const ffmpeg = require("fluent-ffmpeg");

const mergeVideos = (output, videos) => {
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

// const merge = () => {
//   const start = Date.now();
//   console.log("Merging started.");
//   ffmpeg()
//     .input(v4)
//     .input(v4)
//     .on("end", () =>
//       console.log("merged in: ", (Date.now() - start) / 1000, "seconds")
//     )
//     .on("error", (err) => console.log("error!", err))
//     .on("progress", function (progress) {
//       console.log(Math.floor(progress.percent) + "%");
//     })
//     .mergeToFile("merged.mp4");
// };
// merge();
module.exports = { mergeVideos };
