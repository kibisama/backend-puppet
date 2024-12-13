const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.set("port", process.env.PORT || 3002);
app.use(cors());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const cardinalRouter = require("./routes/cardinal");
const psRouter = require("./routes/pharmsaver");
app.use("/cardinal", cardinalRouter);
app.use("/pharmsaver", psRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

const CardinalPuppetError = require("./puppets/cardinal/CardinalPuppetError");
const PSPuppetError = require("./puppets/pharmsaver/PSPuppetError");
app.use((err, req, res, next) => {
  const { puppetIndex } = res.locals;
  if (err instanceof CardinalPuppetError) {
    const cardinalPuppetsOccupied = req.app.get("cardinalPuppetsOccupied");
    if (err.status !== 503) {
      cardinalPuppetsOccupied[puppetIndex] = false;
    }
  } else if (err instanceof PSPuppetError) {
    const psPuppetsOccupied = req.app.get("psPuppetsOccupied");
    if (err.status !== 503) {
      psPuppetsOccupied[puppetIndex] = false;
    }
  }
  console.log(err.message);
  res.sendStatus(err.status || 500);
});

const initPuppets = require("./puppets/initPuppets");
const createServer = async () => {
  await initPuppets(app);
  app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 대기 중");
  });
};
createServer();
