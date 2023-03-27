
const express = require("express");
const app = express();
const path = require("path");
const { logger } = require("./middleware/logger.js");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler.js");
const cors = require("cors");
const corsOptions = require("./config/corsOptions.js");
const connectDb = require("./config/dbConnect.js");
const mongoose = require("mongoose");
require("dotenv").config();

const { logEvents } = require("./middleware/logger.js");

const PORT = process.env.PORT || 5500;
connectDb();



app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/", require("./routes/root"));
app.use('/users',require("./routes/userRoutes"))
app.use('/notes', require("./routes/notesRoutes.js"))

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 not found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("connected to Database");

  app.listen(PORT, () => console.log(`setver is listening on port: ${PORT}`));
});
mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}:${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
}); 
