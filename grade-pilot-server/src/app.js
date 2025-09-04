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

app.set("trust proxy", 1);

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200, // for legacy browsers
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("This is the grade pilot server");
});

app.use("/api", apiRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening to port ${PORT}`);
});
