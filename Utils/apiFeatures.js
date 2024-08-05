class apiFeatures {
  constructor(mongooseQuery, queryString) {
    this.queryString = queryString;
    this.mongooseQuery = mongooseQuery;
  }
  filter() {
    const queryStringObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields", "keyword"];
    excludedFields.forEach((field) => delete queryStringObj[field]);

    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-updatedAt");
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }
  search() {
    if (this.queryString.keyword) {
      const query = {};
      query.$or = [
        { name: { $regex: this.queryString.keyword, $options: "i" } }, 
        { title: { $regex: this.queryString.keyword, $options: "i" } },
        { descreption: { $regex: this.queryString.keyword, $options: "i" } },
      ];
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }
  paginate(allProductsCount) {
    const page = this.queryString.page || 1;
    const limit = this.queryString.limit || 20;
    const skip = (page - 1) * limit;

    let pagination = {};
    pagination.currentPage = +page;
    pagination.limit = +limit;
    pagination.numberOfPages = Math.ceil(allProductsCount / limit);

    const endIndex = page * limit;
    if (endIndex < allProductsCount) {
      pagination.next = +page + 1;
    }
    if (skip > 0) {
      pagination.previous = +page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;
    return this;
  }
  populate(path1, path2) {
    if (path2 == 0) {
      this.mongooseQuery = this.mongooseQuery.populate({
        path: path1,
        select: "name -_id",
      });
      return this;
    } else {
      this.mongooseQuery = this.mongooseQuery.populate([
        {
          path: path1,
          select: "name -_id",
        },
        { path: path2, select: "name -_id", strictPopulate: false },
      ]);
      return this;
    }
  }
}

module.exports = apiFeatures;
