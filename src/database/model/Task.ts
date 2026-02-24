import { Types, model, Schema } from "mongoose";

export interface Task {
	_id: Types.ObjectId;

	title: string;
	description?: string;

	projectId: Types.ObjectId;
	assignedTo: Types.ObjectId;
	createdBy: Types.ObjectId;

	status: "todo" | "in_progress" | "review" | "done";
	priority: "low" | "medium" | "high";

	dueDate?: Date;

	createdAt: Date;
	updatedAt: Date;
}

const schema = new Schema<Task>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    description: {
      type: String,
      trim: true,
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["todo", "in_progress", "review", "done"],
      default: "todo",
      required: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      required: true,
    },

    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

schema.index({ projectId: 1 });
schema.index({ assignedTo: 1 });
schema.index({ status: 1 });
schema.index({ dueDate: 1 });

export const TaskModel = model<Task>("Task", schema);