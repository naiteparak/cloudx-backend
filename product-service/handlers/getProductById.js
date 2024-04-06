import { DynamoDB } from "aws-sdk";

const dynamodbDocumentClient = new DynamoDB.DocumentClient();

export const getProductById = async (event) => {
  console.log("Received event:", JSON.stringify(event.pathParameters, null, 2));

  try {
    const { productId } = event.pathParameters;

    const productParams = {
      TableName: "Products",
      Key: {
        id: productId,
      },
    };

    const productData = await dynamodbDocumentClient
      .get(productParams)
      .promise();

    if (!productData.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `Product with ID:${productId} not found`,
        }),
      };
    }

    const stockParams = {
      TableName: "Stocks",
      FilterExpression: "product_id = :productId",
      ExpressionAttributeValues: {
        ":productId": productId,
      },
    };

    const stockData = await dynamodbDocumentClient.scan(stockParams).promise();

    const mergedData = {
      ...productData.Item,
      count: stockData.Count > 0 ? stockData.Items[0].count : 0,
    };

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
