const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");

const catchAsyncError = require("../utils/catchAsyncError");

dotenv.config();
const bucketName = process.env.S3_BUCKET_NAME;
const bucketRegion = process.env.S3_BUCKET_REGION;
const bucketAccessKey = process.env.S3_BUCKET_ACCESS_KEY;
const bucketSecretAccessKey = process.env.S3_BUCKET_SECRET_ACCESS_KEY;

const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: bucketAccessKey,
    secretAccessKey: bucketSecretAccessKey,
  },
});


exports.uploadImageToS3 =  (imageObj) => {
  const params = {
    Bucket: bucketName,
    ...imageObj,
  };
  const command = new PutObjectCommand(params);
  const awsStrore = s3.send(command);
  return (awsStrore);
};

exports.deleteImageFromS3 =  (imageObj) => {
  const params = {
    Bucket: bucketName,
    ...imageObj,
  };
  const command = new DeleteObjectCommand(params);
  const awsStrore =  s3.send(command);
  return (awsStrore);
}

exports.getImageFromS3 =  (imageObj) => {
  const params = {
    Bucket: bucketName,
    ...imageObj,
  };
  const command = new GetObjectCommand(params);
  const awsStrore =  s3.send(command);
  return (awsStrore);
}