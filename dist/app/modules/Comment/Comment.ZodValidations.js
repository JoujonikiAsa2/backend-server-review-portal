"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentSchemas = exports.postCommentSchema = void 0;
const zod_1 = require("zod");
exports.postCommentSchema = zod_1.z.object({
    content: zod_1.z.string().min(1, "Can't be empty"),
    reviewId: zod_1.z
        .string({
        required_error: "Review id is required",
    })
        .uuid(),
});
exports.CommentSchemas = {
    postCommentSchema: exports.postCommentSchema,
};
