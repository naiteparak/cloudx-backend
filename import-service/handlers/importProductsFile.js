import AWS from "aws-sdk";
const s3 = new AWS.S3({ region: "eu-west-1" });

export const importProductsFile = async (event) => {
  try {
    const { name: fileName } = event.queryStringParameters;
    const filePath = `uploaded/${fileName}`;
    const params = {
      Bucket: "import-service-cloudx",
      Key: filePath,
      Expires: 60,
      ContentType: "text/csv",
    };

    const signedUrl = await s3.getSignedUrlPromise("putObject", params);
    return {
      statusCode: 200,
      body: signedUrl,
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: "Error getting a signed URL for S3 bucket",
    };
  }
};
