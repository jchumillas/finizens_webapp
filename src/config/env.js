var development = process.env.NODE_ENV !== "production";

const Environment = {
  url: development
    ? "http://localhost:5000"
    : "https://finizenstest.herokuapp.com"
};

module.exports = Environment;
