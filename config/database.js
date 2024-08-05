const mongoose = require("mongoose");
const dbConnection = () => {
  mongoose.connect(process.env.DB_URL).then((conn) => {
    console.log("DataBase Connected");
  });
};

module.exports = dbConnection;
