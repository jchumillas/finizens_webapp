var development = process.env.NODE_ENV !== "production";

const Environment = {
  url: development
    ? "http://localhost:5000"
    : "https://finizenstest.herokuapp.com",
  dbUrl: development
    ? "mongodb://localhost:27017/finizensdb"
    : "mongodb://jchumillas:finizens288@ds123346.mlab.com:23346/finizensdb"
};

module.exports = Environment;
