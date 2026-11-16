/**
 * Helper to build paginated, searched, filtered, and sorted Mongoose query responses.
 * 
 * @param {Mongoose.Model} model - Mongoose model to query
 * @param {Object} baseFilter - Base search criteria (e.g. { verificationStatus: 'verified' })
 * @param {Object} queryParams - Express req.query parameters
 * @param {Array<string>} searchFields - Field names to apply regex search on
 * @param {Array<Object|string>} populateOptions - Mongoose populate configs
 * @returns {Promise<Object>} Formatted pagination result with data array and pagination metadata
 */
const buildQueryResult = async (
  model,
  baseFilter = {},
  queryParams = {},
  searchFields = [],
  populateOptions = []
) => {
  const page = Math.max(1, parseInt(queryParams.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(queryParams.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const filter = { ...baseFilter };

  // Apply search keyword across provided text fields
  const searchTerm = queryParams.search || queryParams.q;
  if (searchTerm && searchFields.length > 0) {
    const regex = new RegExp(searchTerm.trim(), "i");
    filter.$or = searchFields.map((field) => ({ [field]: regex }));
  }

  // Sorting
  const sortBy = queryParams.sortBy || "createdAt";
  const sortOrder = queryParams.sortOrder === "asc" || queryParams.sortOrder === "1" ? 1 : -1;
  const sort = { [sortBy]: sortOrder };

  // Query Execution
  let queryObj = model.find(filter).sort(sort).skip(skip).limit(limit);

  if (populateOptions && populateOptions.length > 0) {
    populateOptions.forEach((pop) => {
      queryObj = queryObj.populate(pop);
    });
  }

  const [data, total] = await Promise.all([
    queryObj.exec(),
    model.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

module.exports = { buildQueryResult };
