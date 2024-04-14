export const validateProductData = (title, description, price, count) => {
  return !(
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof price !== "number" ||
    typeof count !== "number" ||
    price <= 0 ||
    count < 0
  );
};
