var development = process.env.NODE_ENV !== "production";

const Environment = {
  url: development
    ? "http://localhost:5000"
    : "https://finizenstest.herokuapp.com",
  dbUrl: development
    ? "mongodb://localhost:27017/finizensdb"
    : process.env.MONGOLAB_URI
};

module.exports = Environment;
