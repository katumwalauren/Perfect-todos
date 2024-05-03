require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectToMongoDB } = require("./database");

const app = express();
app.use(express.json());
app.use(cors());

const router = require("./routes");
app.use("/api", router);

app.get("/api/data", async (req, res) => {
  try {
    const data = await SomeModel.find();

    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const port = process.env.PORT || 5000;

async function startServer() {
  await connectToMongoDB();
  app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
  });
}
startServer();
