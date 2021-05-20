const fs = require("fs");
const Jimp = require("jimp");

const createImage = async ({ name, text, leftPosition, topPositon }) => {
  const image = await Jimp.read("./images/maroon.png");

  // await image.resize(400, 50);
  await image.crop(0, 0, 1500, 380);
  await image.opacity(0.9);

  const font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
  image.print(font, leftPosition, topPositon, text, 1200);

  await image.writeAsync(`./videos/${name}`);
};

module.exports = { createImage };
