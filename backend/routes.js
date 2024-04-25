
const express = require("express");
const router = express.Router();
const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb");

const getCollection = async () => {
  const client = getConnectedClient();
  const collection = client.db("todosdb").collection("todos");
  return collection;
};

router.get("/todos", async (req, res) => {
  try {
    const collection = await getCollection(); 
    const todos = await collection.find({}).toArray();

    res.status(200).json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/todos", async (req, res) => {
  try {
    const collection = await getCollection(); 
    const { todo } = req.body;
    const newTodo = await collection.insertOne({ todo, status: false });
    res.status(201).json({ todo, status: false, _id: newTodo.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
router.delete("/todos/:id", async (req, res) => {
  try {
    const collection = await getCollection(); 
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const _id = new ObjectId(id);

    const deletedTodo = await collection.deleteOne({ _id }); 
    res.status(200).json(deletedTodo);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/todos/:id", async (req, res) => {
  try {
    const collection = await getCollection();
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const _id = new ObjectId(id);
    const { status } = req.body;

    const updatedTodo = await collection.updateOne({ _id }, { $set: { status: !status } });
    res.status(200).json(updatedTodo);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
