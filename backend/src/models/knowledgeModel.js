import mongoose from 'mongoose';

const commentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: { type: String, required: true },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const knowledgeSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

const Knowledge = mongoose.model('Knowledge', knowledgeSchema);

export default Knowledge;
