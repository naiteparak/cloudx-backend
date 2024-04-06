import { DynamoDB } from "aws-sdk";
import { randomUUID } from "node:crypto";
import { validateProductData } from "../utils/validateProductData.js";

const dynamodbDocumentClient = new DynamoDB.DocumentClient();

export const createProduct = async (event) => {
  console.log("Received event:", JSON.stringify(event.body, null, 2));

  try {
    const { title, description, price, count } = JSON.parse(event.body);

    if (!validateProductData(title, description, price, count)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid product data" }),
      };
    }

    const id = randomUUID();

    const productData = {
      id,
      title,
      description,
      price,
    };

    const stockData = {
      product_id: id,
      count,
    };

    const transactionParams = {
      TransactItems: [
        {
          Put: {
            TableName: "Stocks",
            Item: stockData,
          },
        },
        {
          Put: {
            TableName: "Products",
            Item: productData,
          },
        },
      ],
    };

    await dynamodbDocumentClient.transactWrite(transactionParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Product created successfully" }),
    };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
