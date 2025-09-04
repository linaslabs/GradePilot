import express from "express";
import cors from "cors";
import "dotenv/config.js";
import rateLimiter from "express-rate-limit";
import helmet from "helmet";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/error.js";
import apiRouter from "./routes/apiRouter.js";

const app = express();
const PORT = 3000;

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(express.json());
app.use(helmet());
app.use(cors());

app.get("/", (req, res) => {
  res.send("This is the grade pilot server");
});

app.use("/api", apiRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening to port ${PORT}`);
});
