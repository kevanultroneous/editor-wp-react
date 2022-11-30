const aggreFilters = {
  homePage: {
    filters: {
      isApproved: true,
      draftStatus: "published",
      isActive: true,
      postType: "press",
      releaseDate: { $lte: new Date() },
    },
    sorting: { submittedDate: 1 },
    limits: 7,
  },
  category: {
    filters: {
      isActive: true,
      parentCategory: null,
    },
    project: {
      title: 1,
      parentCategory: 1,
      postType: 1,
      isActive: 1,
    },
    subCategories: {
      from: "categories",
      localField: "_id",
      foreignField: "parentCategory",
      as: "childs",
    },
  },
};

module.exports = { aggreFilters };
