import mongoose from "mongoose";
const {Schema} = mongoose;
const CommentSchema = new Schema(
    {
      post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true,
        index: true,
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 5000, // adjust as needed
      },
      parent: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
        index: true,
      },
      depth: {
        type: Number,
        default: 0,
        min: 0,
        max: 3, // cap nesting
      },
      isDeleted: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  );

const Comment = mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
export default Comment;
