const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/react-times', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    // findByIdAndUpdate is deprecated thats why we need to add this here
    useFindAndModify: false,
});