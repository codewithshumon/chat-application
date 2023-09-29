//External imports
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const moment = require("moment");
const http = require("http");

//Internal imports
const { errorhandler, notFoundError } = require("./middlewares/common/errorHandler");
const loginRouter = require("./router/loginRouter");
const usersRouter = require("./router/usersRouter");
const inboxRouter = require("./router/inboxRouter");

const app = express();
const server = http.createServer(app);

//.env file config
dotenv.config();

//socket.io setting. Here io is a clent io
const io = require("socket.io")(server);
//global.io here global is server global objeect. we can use io using global.io
global.io = io;

// set moment as app locals
app.locals.moment = moment;

//database connection
mongoose
    .connect(process.env.MONGO_CONNECTION)
    .then(() => {
        console.log("Database connected!");
    })
    .catch((err) => console.log(err));

//request data parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//set view engine for ejs templet
app.set("view engine", "ejs");

//set static folder
app.use(express.static(path.join(__dirname, "public")));

//cookie data parser
app.use(cookieParser(process.env.COOKIE_SECRET));

//Routing handling
app.use("/", loginRouter);
app.use("/users", usersRouter);
app.use("/inbox", inboxRouter);

//404 Not found handling
app.use(notFoundError);

//common error handling
app.use(errorhandler);

app.listen(process.env.PORT, (err) => {
    console.log(`App starting to port ${process.env.PORT}`);
});
