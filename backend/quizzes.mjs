import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// This section will help you get a list of all the quizzes.
router.get("/", async (req, res) => {
  let collection = await db.collection("quizzes");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// This section will help you get a single quiz by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("quizzes");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you create a new quiz.
router.post("/", async (req, res) => {
  try {
    const { name, description, type, questions } = req.body;

    // Check if quiz name already exists
    const existingQuiz = await db.collection("quizzes").findOne({ name });
    if (existingQuiz) {
      console.log("Quiz namnet existerar redan");
      return res.status(400).json({ error: "Quiz namnet finns redan" });
    }

    // If the quiz name doesnt exist create a new quiz
    const newDocument = {
      name,
      description,
      type,
      questions,
    };
    const collection = await db.collection("quizzes");
    const result = await collection.insertOne(newDocument);

    console.log("Skapad quiz");
    res.status(201).json(result);
  } catch (error) {
    console.error("Fel vid skapa quiz:", error);
    res.status(500).json({ error: "misslyckad" });
  }
});

// This section will help you update a quiz by id.
router.patch("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const updates = {
    $set: {
      id: req.body.quizId,
      name: req.body.name,
      description: req.body.description,
      type: req.body.type,
      question: req.body.question,
      // option_a: req.body.option_a,
      // option_b: req.body.option_b,
      // option_c: req.body.option_c,
      // option_d: req.body.option_d,
      // solution: req.body.solution
    },
  };

  let collection = await db.collection("quizzes");
  let result = await collection.updateOne(query, updates);

  res.send(result).status(200);
});

// This section will help you delete a quiz
router.delete("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };

  const collection = db.collection("quizzes");
  let result = await collection.deleteOne(query);

  res.send(result).status(200);
});

export default router;
