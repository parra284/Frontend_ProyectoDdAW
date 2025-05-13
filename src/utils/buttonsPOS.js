export const getButtons = (navigate) => [
  {
    label: "Products",
    action: () => navigate("/products"),
    actionPath: "/products", // Add the path for comparison
  },
  {
    label: "Orders",
    action: () => navigate("/orders"),
    actionPath: "/orders", // Add the path for comparison
  },
];