import { model, Schema, Types } from "mongoose";

export const DOCUMENT_NAME = "User";
export const COLLECTION_NAME = "users";

export interface User {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
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
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

schema.index({ role: 1 });
schema.index({ createdAt: -1 });

export const UserModel = model<User>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);