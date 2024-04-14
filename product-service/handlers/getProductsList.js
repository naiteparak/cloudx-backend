import { DynamoDB } from "aws-sdk";

const dynamodbDocumentClient = new DynamoDB.DocumentClient();

export const getProductsList = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  try {
    const productsData = await dynamodbDocumentClient
      .scan({ TableName: "Products" })
      .promise();

    const stocksData = await dynamodbDocumentClient
      .scan({ TableName: "Stocks" })
      .promise();

    const mergedData = productsData.Items.map((product) => {
      const correspondingStock = stocksData.Items.find(
        (stock) => stock.product_id === product.id,
      );

      return {
        ...product,
        count: correspondingStock ? correspondingStock.count : 0,
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(mergedData),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Internal Server Error: ${err.message}`,
      }),
    };
  }
};
