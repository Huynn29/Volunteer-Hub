const mongoose = require("mongoose");  

const PostSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: {
        type: String,
        enum: ["user", "manager", "admin"],
    },
    content: { type: String, required: true },
    images: [String],
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    approvedAt: { type: Date }, 
    rejectedAt: {type: Date}
}, { timestamps: true });

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
