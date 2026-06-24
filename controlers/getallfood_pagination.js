
import foodsmodel from "../Schema/foodsSchema.js";

async function getAllFoods_pagination(req, res) {
  try {
    // Extract the last_product_id from the request body
    const { last_product_id } = req.body;
    const limit = 10;

    // Build the query: If last_product_id exists, fetch items after it. 
    // If it doesn't exist (e.g., the first page), fetch from the beginning.
    let query = {};
    if (last_product_id) {
      query = { _id: { $gt: last_product_id } };
    }

    // Execute the query with sorting and limiting
    const result = await foodsmodel
      .find(query)
      .sort({ _id: 1 }) // Crucial: ensures the data is strictly ordered by ID
      .limit(limit);

    // Get the ID of the last item in this batch to help the frontend fetch the next page
    const next_last_product_id = result.length > 0 ? result[result.length - 1]._id : null;

    res.send({
      status: true,
      message: result,
      next_last_product_id: next_last_product_id, // The frontend will use this for the next request
      source: 'database'
    });
  } catch (error) {
    console.error("Error fetching foods data:", error);
    res.status(500).send({
      status: false,
      message: "Failed to retrieve food data",
      error: error.message,
    });
  }
}

export { getAllFoods_pagination };