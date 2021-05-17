const ffmpeg = require("fluent-ffmpeg");
const { mergeVideos } = require("./mergeVideos");
const { trimVideo } = require("./trimVideo");
const fs = require("fs");
const Jimp = require("jimp");

// trimVideo(video,output,  startSecond, stopSecond, () => {
//   mergeVideos(output, videos);
// });

if (0) trimVideo("2.mp4", "short.mp4", 5, 6, () => {});

async function resize() {
  // Read the image.
  const image = await Jimp.read(
    "https://images.unsplash.com/photo-1568788282721-8579749fb7a2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2682&q=80"
  );

  // await image.resize(400, 50);
  await image.crop(0, 0, 1000, 500);
  await image.opacity(0.9);

  const font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
  image.print(font, 200, 110, "WITAM WSZYSTKICH", 500);

  await image.writeAsync(`./videos/image.png`);
}
resize();

ffmpeg("./videos/short.mp4")
  .input("./videos/image.png")
  .addOptions(["-strict -2"])
  .complexFilter(
    [
      {
        filter: "overlay",
        options: {
          enable: "between(t,0,2)",
          x: "100",
          y: "300",
        },
        inputs: "[0:v][1:v]",
        outputs: "tmp",
      },
    ],
    "tmp"
  )
  .output("./videos/withimage.mp4")
  .run();
