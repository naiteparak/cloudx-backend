import products from "../products/products.json" assert { type: "json" };

export const getProductsList = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  };

  try {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(products),
    };
  } catch {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
