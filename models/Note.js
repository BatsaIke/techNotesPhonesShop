const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose)

const notesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      require: true,
    },
    completed: {
      type: Boolean,
      defaault: false,
    },
  },
  {
    timestamps: true,
  }
);
 notesSchema.plugin(AutoIncrement,{
    inc_field: 'ticket',
    id: "ticketNum",
    start_seq: 0
 })
module.exports = mongoose.model("Notes", notesSchema);
