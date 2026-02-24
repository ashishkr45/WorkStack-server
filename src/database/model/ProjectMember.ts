import { Types, Schema, model } from "mongoose";

export interface ProjectMember {
	_id: Types.ObjectId;

	projectId: Types.ObjectId;
	userId: Types.ObjectId;

	projectRole: "owner" | "manager" | "member";

	joinedAt: Date;
}

const schema = new Schema<ProjectMember>(
	{
		projectId: {
			type: Schema.Types.ObjectId,
			ref: "Project",
			required: true,
		},

		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		projectRole: {
			type: String,
			enum: ["owner", "manager", "member"],
			default: "member",
			required: true,
		},

		joinedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		versionKey: false,
	}
);

schema.index({ projectId: 1, userId: 1 }, { unique: true });
export const ProjectMemberModel = model<ProjectMember>(
	"ProjectMember",
	schema
);