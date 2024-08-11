import mongoose from "mongoose";
const userSchema = mongoose.Schema({
  score: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
  },
});

const Scores = mongoose.model("Scores", userSchema);
export default Scores;
