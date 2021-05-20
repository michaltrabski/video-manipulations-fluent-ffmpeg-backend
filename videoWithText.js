const ffmpeg = require("fluent-ffmpeg");

const videoWithText = ({ name }) => {
  ffmpeg("./videos/short.mp4")
    .input("./videos/text1.png")
    .input("./videos/text2.png")
    .input("./images/elka.png")
    .addOptions(["-strict -2"])
    .complexFilter(
      [
        {
          filter: "overlay",
          options: {
            enable: "between(t,0,2)",
            x: "50",
            y: "50",
          },
          inputs: "[0:v][1:v]",
          outputs: "tmp",
        },
        {
          filter: "overlay",
          options: {
            enable: "between(t,0,2)",
            x: "2000",
            y: "1300",
          },
          inputs: "[tmp][2:v]",
          outputs: "tmp",
        },
        {
          filter: "overlay",
          options: {
            enable: "between(t,0,2)",
            x: "50",
            y: "1300",
          },
          inputs: "[tmp][3:v]",
          outputs: "tmp",
        },
      ],
      "tmp"
    )
    .output("./videos/" + name)
    .run();
};

module.exports = { videoWithText };
