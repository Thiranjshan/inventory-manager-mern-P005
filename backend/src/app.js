import express from "express";
import cors from "cors";

import itemRoutes from "./routes/item.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Inventory API Running");
});

app.use("/api/items", itemRoutes);

export default app;