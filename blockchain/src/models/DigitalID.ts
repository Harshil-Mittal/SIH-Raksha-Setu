import mongoose, { Document, Schema } from 'mongoose';

export interface IDigitalID extends Document {
  _id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  walletAddress: string;
  timestamp: number;
  hash: string;
  verified: boolean;
  additionalData?: any;
  createdAt: Date;
  updatedAt: Date;
}

const DigitalIDSchema = new Schema<IDigitalID>({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    index: true
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['admin', 'police', 'tourism', 'tourist'],
    index: true
  },
  walletAddress: {
    type: String,
    required: [true, 'Wallet address is required'],
    validate: {
      validator: function(v: string) {
        return /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: 'Invalid wallet address format'
    },
    index: true
  },
  timestamp: {
    type: Number,
    required: [true, 'Timestamp is required'],
    index: true
  },
  hash: {
    type: String,
    required: [true, 'Hash is required'],
    unique: true,
    index: true
  },
  verified: {
    type: Boolean,
    default: false,
    index: true
  },
  additionalData: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Compound indexes for better query performance
DigitalIDSchema.index({ userId: 1, verified: 1 });
DigitalIDSchema.index({ email: 1, role: 1 });
DigitalIDSchema.index({ walletAddress: 1, verified: 1 });
DigitalIDSchema.index({ createdAt: -1 });

export default mongoose.model<IDigitalID>('DigitalID', DigitalIDSchema);
