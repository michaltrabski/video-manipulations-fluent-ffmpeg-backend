const ffmpeg = require("fluent-ffmpeg");
const { mergeVideos } = require("./mergeVideos");
const { trimVideo } = require("./trimVideo");

// trimVideo(output, video, startSecond, drationSeconds, () => {
//   mergeVideos(output, videos);
// });

trimVideo("./pulapka-przed-przejsciem.mp4", "./a.mp4", 110, 63, () => {});
// trimVideo("./b.mp4", "./bbb.mp4", 0, 1, () => {});

// const filter = [
//   "[0:v]scale=300:300[0scaled]",
//   "[1:v]scale=300:300[1scaled]",
//   "[0scaled]pad=600:300[0padded]",
//   "[0padded][1scaled]overlay=shortest=1:x=300[output]",
// ];
const filter = [
  "[0:v]scale=100:100[0scaled]",
  "[1:v]scale=100:100[1scaled]",
  "[0scaled]pad=300:300[0padded]",
  "[0padded][1scaled]overlay=shortest=1:x=100[output]",
];
// ffmpeg()
//   .input("a.mp4")
//   .input("b.mp4")
//   .complexFilter(filter)
//   .outputOptions(["-map [output]"])
//   .output("c.mp4")
//   .on("error", function (er) {
//     console.log("error occured: " + er.message);
//   })
//   .on("end", function () {
//     console.log("success");
//   })
//   .on("progress", (progress) => console.log(Math.floor(progress.percent) + "%"))
//   .run();
