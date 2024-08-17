const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");

const apiError = require("./Utils/apiError.js");
const globalError = require("./Middleware/error.js");
const dbConnection = require("./config/database.js");
const mountRoutes = require("./Routes/indexRoutes.js");

const app = express();

app.use(cors());
app.options("*", cors());
app.use(compression()); 

dotenv.config({ path: "config.env" });

dbConnection();

app.use(express.json());

app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new apiError(`Cannot Find This Route: ${req.originalUrl}`, 400));
});

app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log("Listenning On Port ", PORT);
});

process.on("unhandledRejection", (err) => {
  console.log(`Unhandled Rejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Shuting Down....");
    process.exit(1);
  });
});
