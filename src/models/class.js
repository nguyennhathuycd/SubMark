var mongoose = require('mongoose');

var ClassesSchema = new mongoose.Schema({
    class_name: {
      type: String,
      required: true,
    },
});

var Class = mongoose.model('classes', ClassesSchema);
module.exports = Class;