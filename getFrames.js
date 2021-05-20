const ffmpeg = require("fluent-ffmpeg");

const getFrames = (_input, _output) => {
  const input = "./videos/" + _input;
  const output = "./videos/" + _output;

  ffmpeg(input)
    .on("filenames", function (filenames) {
      console.log("Will generate " + filenames.join(", "));
    })
    .on("end", function () {
      console.log("Screenshots taken");
    })
    .screenshots({
      // Will take screens at 20%, 40%, 60% and 80% of the video
      count: 20,
      folder: "./videos/",
    });
};

module.exports = { getFrames };
