import mongoose from 'mongoose';

const partySchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  timestamp: { type: Number, default: Date.now },
  status: { type: String, enum: ['waiting'], default: 'waiting' }
}, {
  // Transform _id to id in JSON responses
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const Party = mongoose.model('Party', partySchema);