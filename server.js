const express = require("express"); // Sử dụng framework express
const { default: mongoose } = require("mongoose");
const app = express();
const cors = require("cors");
const serverless = require("serverless-http");
const { createProxyMiddleware } = require("http-proxy-middleware");
const port = parseInt(process.env.PORT, 10) || 5000

//=========================================================================================================================================================
//API ROUTES
const project = require("./api/route/project.route");
const user = require("./api/route/user.route");
const appl = require("./api/route/application.route");
const auth = require("./api/utils/auth");

//=========================================================================================================================================================
//CONNECT DATABASE
mongoose.connect(
  "mongodb+srv://kimdat0705:kimdatkimdat0705@cluster0.duoyvfe.mongodb.net/hippro"
);

mongoose.connection.on("connected", () => {
  console.log("> Connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.log("err connecting", err);
});

//=========================================================================================================================================================
//SCHEMA MODEL
require("./api/model/project.model");
require("./api/model/user.model");
require("./api/model/application.model");

//=========================================================================================================================================================
//APP/SERVER

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5000",
      changeOrigin: true,
    })
  );
};

app.use(cors());

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

//parse form data
app.use(express.urlencoded({ extended: false }));

//parse json
app.use(express.json());

//route
app.use("/", auth);
app.use("/api/prj", project);
app.use("/api/user", user);
app.use("/api/appl", appl);

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${port}`);
});

module.exports = app;
module.exports.handler = serverless(app);
