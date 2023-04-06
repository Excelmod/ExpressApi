const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(String(process.env.DATABASE_URI), {
            useUnifiedTopology: true,
            useNewUrlPArser: true,
        })
    } catch (err) {
        console.error(err)
    }
}

module.exports = connectDB
