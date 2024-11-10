const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const NotesSchema = new Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
  });

  const Notes = mongoose.model('notes',NotesSchema);
  Notes.createIndexes();
  module.exports = Notes;