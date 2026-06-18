import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IBranch extends Document {
  name: string;
  code: string;
  address: string;
  phone: string;
  email?: string;
  managerId: mongoose.Types.ObjectId;
  isActive: boolean;
  settings: {
    currency: string;
    taxRate: number;
    lowStockThreshold: number;
    expiryWarningDays: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BranchSchema = new Schema<IBranch>(
  {
    name: {
      type: String,
      required: [true, 'Branch name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Branch code is required'],
      unique: true,
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    managerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    settings: {
      currency: {
        type: String,
        default: 'USD',
      },
      taxRate: {
        type: Number,
        default: 0,
        min: [0, 'Tax rate cannot be negative'],
      },
      lowStockThreshold: {
        type: Number,
        default: 10,
        min: [0, 'Low stock threshold cannot be negative'],
      },
      expiryWarningDays: {
        type: Number,
        default: 15,
        min: [0, 'Expiry warning days cannot be negative'],
      },
    },
  },
  {
    timestamps: true,
  }
);

const Branch: Model<IBranch> = mongoose.models.Branch || mongoose.model<IBranch>('Branch', BranchSchema);

export default Branch;
