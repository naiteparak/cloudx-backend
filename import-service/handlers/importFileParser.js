import AWS from "aws-sdk";
const s3 = new AWS.S3({ region: "eu-west-1" });
import csvParser from "csv-parser";

export const importFileParser = (event) => {
  event.Records.forEach((record) => {
    const sourceBucket = record.s3.bucket.name;
    const sourceKey = record.s3.object.key;
    const destinationKey = sourceKey.replace("uploaded", "parsed");
    const s3Stream = s3
      .getObject({
        Bucket: "import-service-cloudx",
        Key: record.s3.object.key,
      })
      .createReadStream();

    s3Stream
      .pipe(csvParser())
      .on("data", (data) => {
        console.log(data);
      })
      .on("end", async () => {
        console.log("Parse complete");
        await s3
          .copyObject({
            Bucket: sourceBucket,
            CopySource: `${sourceBucket}/${sourceKey}`,
            Key: destinationKey,
          })
          .promise();

        await s3
          .deleteObject({
            Bucket: sourceBucket,
            Key: sourceKey,
          })
          .promise();

        console.log(
          `File moved from uploaded to parsed folder: ${destinationKey}`,
        );
      });
    console.log(record);
  });
};
