const imageMin = require("imagemin");
const mozJpeg = require("imagemin-mozjpeg");
const fs = require("fs");

exports.reduceWithImageMin = async function (imageBuffer, filename) {
  const reducedImage = await imageMin.buffer(imageBuffer, {
    plugins: [mozJpeg({ quality: 80 })],
  });
  return reducedImage;
};

exports.reduceWithImageThumbnail = async function (imageBuffer, filename) {
  const reducedImage = await imageMin.buffer(imageBuffer, {
    plugins: [mozJpeg({ quality: 80 })],
  });
  return reducedImage;
};
