var mongoose = require('mongoose');

var ClassesSchema = new mongoose.Schema({
    class_name: {
      type: String,
      required: true,
    },
    class_topic: {
      type: String,
    },
    class_ID: {
      type: String,
    },
    class_code: {
      type: String,
    },
    assignmentIDs: []
});

var Class = mongoose.model('classes', ClassesSchema);
module.exports = Class;