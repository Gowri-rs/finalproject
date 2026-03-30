require("dotenv").config();
const mongoose = require("mongoose");
const Question = require("./models/question");

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  await Question.updateMany(
    { question: "How do you usually feel when starting your day?" },
    { imageKey: "morning" }
  );

  await Question.updateMany(
    { question: "How do daily responsibilities affect you lately?" },
    { imageKey: "responsibilities" }
  );

  await Question.updateMany(
    { question: "How often do you feel emotionally disconnected?" },
    { imageKey: "disconnected" }
  );

  await Question.updateMany(
    { question: "How is your sleep experience recently?" },
    { imageKey: "sleep" }
  );

  await Question.updateMany(
    { question: "How do you react to unexpected problems?" },
    { imageKey: "stress" }
  );

  await Question.updateMany(
    { question: "How connected do you feel with people around you?" },
    { imageKey: "connection" }
  );

  console.log("✅ imageKey updated");
  process.exit();
})
.catch(err => {
  console.log(err);
  process.exit();
});