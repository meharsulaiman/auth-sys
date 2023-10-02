const mongoose = require('mongoose');

const connectDatabase = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'authsys',
  });
  console.log('MongoDB Connected Successfully');
};

module.exports = connectDatabase;
