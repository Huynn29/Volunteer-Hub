const mongoose = require("mongoose");

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("connect database success")
    } catch (error) {
        console.log("connect database failed ", error.message);
        process.exit(1);
    }
};

console.log("MONGO_URL:", process.env.MONGO_URL);

mongoose.connection.once("open", () => {
    console.log("✅ MongoDB connected");
    console.log("DATABASE:", mongoose.connection.name);
    console.log("HOST:", mongoose.connection.host);
});

module.exports = connectDatabase;