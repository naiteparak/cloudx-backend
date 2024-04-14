import products from "./mocks/products.json" assert { type: "json" };
import stocks from "./mocks/stocks.json" assert { type: "json" };
import AWS from "aws-sdk";
const { DynamoDB, config } = AWS;

config.update({ region: "eu-west-1" });

const dynamodbDocumentClient = new DynamoDB.DocumentClient();

const populateTable = async (tableName, items) => {
  for (const item of items) {
    const params = {
      TableName: tableName,
      Item: item,
    };

    try {
      await dynamodbDocumentClient.put(params).promise();
      console.log(
        `Item inserted into ${tableName}: ${JSON.stringify(item, null, 2)}`,
      );
    } catch (error) {
      console.error(
        `Unable to insert item into ${tableName}. Error: ${error.message}`,
      );
    }
  }
};

await populateTable("Products", products);
await populateTable("Stocks", stocks);
