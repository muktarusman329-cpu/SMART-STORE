import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ILoyalty extends Document {
  customerId: mongoose.Types.ObjectId;
  pointsBalance: number;
  pointsEarned: number;
  pointsRedeemed: number;
  level: string;
  totalSpent: number;
  rewards: {
    rewardId: mongoose.Types.ObjectId;
    rewardName: string;
    pointsUsed: number;
    redeemedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const LoyaltySchema = new Schema<ILoyalty>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer ID is required'],
      unique: true,
    },
    pointsBalance: {
      type: Number,
      default: 0,
      min: [0, 'Points balance cannot be negative'],
    },
    pointsEarned: {
      type: Number,
      default: 0,
      min: [0, 'Points earned cannot be negative'],
    },
    pointsRedeemed: {
      type: Number,
      default: 0,
      min: [0, 'Points redeemed cannot be negative'],
    },
    level: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum'],
      default: 'bronze',
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: [0, 'Total spent cannot be negative'],
    },
    rewards: [{
      rewardId: {
        type: Schema.Types.ObjectId,
        ref: 'Reward',
      },
      rewardName: {
        type: String,
        required: true,
      },
      pointsUsed: {
        type: Number,
        required: true,
        min: [0, 'Points used cannot be negative'],
      },
      redeemedAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  {
    timestamps: true,
  }
);

LoyaltySchema.index({ customerId: 1 });
LoyaltySchema.index({ level: 1 });

const Loyalty: Model<ILoyalty> = mongoose.models.Loyalty || mongoose.model<ILoyalty>('Loyalty', LoyaltySchema);

export default Loyalty;
