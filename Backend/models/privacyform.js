import mongoose from "mongoose";

const privacySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    timeOfBirth: String,
    place: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    whatsapp: {
        type: String,
        required: true,
    },
    purpose: {
        type: String,
        required: true,
    },
    profession: {
        type: String,
        required: true,
    },
    lastGem: {
        type: String,
        required: true,
    },
    comment: String,
}, { timestamps: true });

const PrivacyForm = mongoose.model("PrivacyForm", privacySchema);

export default PrivacyForm;