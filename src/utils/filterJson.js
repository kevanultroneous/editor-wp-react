const aggreFilters = {
  homePage: {
    filters: {
    isApproved: true,
    draftStatus: "published",
    isActive: true,
    postType: "press",
    releaseDate: { $lte: new Date() },
  },
  sorting: {submittedDate: 1},
  limits: 7
}
};


module.exports = {aggreFilters}