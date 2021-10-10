const mongoose = require('mongoose');

async function connect() {
  try {
    // process.env.MONGODB_URI
    await mongoose.connect('mongodb+srv://nguyennhathuycd:*N123456789@cluster0.wvlgp.mongodb.net/supmark?retryWrites=true&w=majority')
    console.log('Connect successfully!!!');
  } catch (error) {
    console.log('Connect failure!!!');
  }
}

module.exports = { connect };
