const errorHandler = (err, req, res) => {
  res.status(500).json({
    status: 500,
    message: "Something went wrong",
    data: err.message
  });
};

module.exports = errorHandler;