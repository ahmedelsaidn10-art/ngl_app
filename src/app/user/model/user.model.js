import { model, Schema } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 20,
        },
         email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: function () {
                return this.provider === "local";
            },
            
        },

        provider: {
            type: String,
            default: "local",
            enum: ["local", "google", "facebook"],
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },
        dob: Date,
        gender: {
            type: String,
            enum: ["male", "female"],
            default: "male",
        },
    },
    {
        timestamps: true,
    }
)

export const User = model("User", userSchema);