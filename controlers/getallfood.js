import foodsmodel from "../Schema/foodsSchema.js";

async function getAllFoods(req, res) {
  try {
    // Fetch all food data from the database
    const result = await foodsmodel.find();

    // Respond with the data
    res.send({
      status: true,
      message: result,
    });
  } catch (error) {
    // Handle any errors during the fetch operation
    console.error("Error fetching foods data:", error);
    res.status(500).send({
      status: false,
      message: "Failed to retrieve food data",
      error: error.message,
    });
  }
}

export { getAllFoods };
