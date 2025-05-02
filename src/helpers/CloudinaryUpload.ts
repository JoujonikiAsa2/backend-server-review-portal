import { v2 as cloudinary } from "cloudinary";
import { RequestHandler } from "express";
import { Readable } from "stream";
cloudinary.config({
  cloud_name: "ds0y5kjhc",
  api_key: "898154395629377",
  api_secret: "q24pv6f1HqtmkmFl-SN6-YxiSbw", // Click 'View API Keys' above to copy your API secret
});
export const UploadToCloudinary: RequestHandler = async function (
  req,
  res,
  next
) {
  const buffer = req.file?.buffer!;
  req.body = JSON.parse(req.body.data);
  console.log("hitting");
  return new Promise((res, rej) => {
    if (buffer) {
      const theTransformStream = cloudinary.uploader.upload_stream(
        {
          public_id: req.file?.originalname,
          resource_type: "auto",
        },
        (err, result) => {
          if (err) return rej(err);
          if (result) {
            req.body.imageUrl = result?.secure_url;
            next();
          }
        }
      );
      const stream = Readable.from(buffer).pipe(theTransformStream);
      // console.log("body", req.body);
    } else {
      next();
    }
  });
};
