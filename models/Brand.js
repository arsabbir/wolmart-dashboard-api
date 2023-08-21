import mongoose from "mongoose";

const brandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    photo: {
      type: String,
      trim: true,
      default: null,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: Boolean,
      default: true,
    },
    trash: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Brand", brandSchema);
