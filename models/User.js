import mongoose from "mongoose";
const {Schema} = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,

    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    profileImage: {
        type: String,
    
    },
    bannerImage: {
        type: String,
    
    },
    bio: {
        type: String,
    
    },
    
})

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
