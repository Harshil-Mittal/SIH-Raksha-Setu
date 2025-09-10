import mongoose, { Document, Schema } from 'mongoose';

export interface IDigitalIdentity extends Document {
  _id: string;
  userId: string;
  walletAddress: string;
  identityId: number; // Blockchain identity ID
  name: string;
  email: string;
  nationality: string;
  aadhaarHash?: string;
  passportHash?: string;
  emergencyContact: string;
  roles: string[];
  isVerified: boolean;
  isActive: boolean;
  verificationDate?: Date;
  verifierAddress?: string;
  txHash?: string; // Transaction hash from blockchain
  createdAt: Date;
  updatedAt: Date;
}

const DigitalIdentitySchema = new Schema<IDigitalIdentity>({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    ref: 'User'
  },
  walletAddress: {
    type: String,
    required: [true, 'Wallet address is required'],
    unique: true,
    validate: {
      validator: function(v: string) {
        return /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: 'Invalid wallet address format'
    }
  },
  identityId: {
    type: Number,
    required: [true, 'Identity ID is required'],
    unique: true
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
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  nationality: {
    type: String,
    required: [true, 'Nationality is required'],
    trim: true,
    maxlength: [50, 'Nationality cannot exceed 50 characters']
  },
  aadhaarHash: {
    type: String,
    sparse: true,
    maxlength: [64, 'Aadhaar hash cannot exceed 64 characters']
  },
  passportHash: {
    type: String,
    sparse: true,
    maxlength: [64, 'Passport hash cannot exceed 64 characters']
  },
  emergencyContact: {
    type: String,
    required: [true, 'Emergency contact is required'],
    trim: true,
    maxlength: [20, 'Emergency contact cannot exceed 20 characters']
  },
  roles: [{
    type: String,
    required: true
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  verificationDate: {
    type: Date
  },
  verifierAddress: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: 'Invalid verifier address format'
    }
  },
  txHash: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^0x[a-fA-F0-9]{64}$/.test(v);
      },
      message: 'Invalid transaction hash format'
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
DigitalIdentitySchema.index({ userId: 1 });
DigitalIdentitySchema.index({ walletAddress: 1 });
DigitalIdentitySchema.index({ identityId: 1 });
DigitalIdentitySchema.index({ email: 1 });
DigitalIdentitySchema.index({ isVerified: 1 });
DigitalIdentitySchema.index({ isActive: 1 });

export default mongoose.model<IDigitalIdentity>('DigitalIdentity', DigitalIdentitySchema);
