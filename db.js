const mongoose = require('mongoose');
const mongURI = "mongodb://localhost:27017/inotebook1"

const connectToMongo = () => {
    mongoose.connect(mongURI)
}

module.exports = connectToMongo;