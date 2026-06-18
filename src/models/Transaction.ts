import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ITransactionItem {
  productId: mongoose.Types.ObjectId;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
}

export interface ITransaction extends Document {
  transactionId: string;
  customerId?: mongoose.Types.ObjectId;
  orderId?: mongoose.Types.ObjectId;
  items: ITransactionItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'paystack';
  pointsEarned: number;
  branchId?: mongoose.Types.ObjectId;
  cashierId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const TransactionItemSchema = new Schema<ITransactionItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative'],
  },
});

const TransactionSchema = new Schema<ITransaction>(
  {
    transactionId: {
      type: String,
      required: [true, 'Transaction ID is required'],
      unique: true,
      trim: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    items: [TransactionItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative'],
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'Total cannot be negative'],
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'transfer', 'paystack'],
      required: [true, 'Payment method is required'],
    },
    pointsEarned: {
      type: Number,
      default: 0,
      min: [0, 'Points earned cannot be negative'],
    },
    branchId: {
      type: Schema.Types.ObjectId,
      ref: 'Branch',
    },
    cashierId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

TransactionSchema.index({ customerId: 1, createdAt: -1 });
TransactionSchema.index({ createdAt: -1 });

const Transaction: Model<ITransaction> = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
