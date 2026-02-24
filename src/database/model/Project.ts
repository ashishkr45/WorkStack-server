import { model, Schema, Types } from "mongoose";

export default interface Project {
	_id: Types.ObjectId;
	name: string;
	description?: string;

	createdBy: Types.ObjectId; 
	members: Types.ObjectId[];

	status: "active" | "archived";

	startDate?: Date;
	endDate?: Date;

	createdAt: Date;
	updatedAt: Date;
}

const schema = new Schema<Project>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			maxlength: 200,
		},

		description: {
			type: String,
			trim: true,
		},

		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		members: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],

		status: {
			type: String,
			enum: ["active", "archived"],
			default: "active",
			required: true,
		},

		startDate: {
			type: Date,
		},

		endDate: {
			type: Date,
		},
	},
	{
		timestamps: true,
	}
);

schema.index({ createdBy: 1 });
schema.index({ members: 1 });
schema.index({ status: 1 });

export const ProjectModel = model<Project>("Project", schema);