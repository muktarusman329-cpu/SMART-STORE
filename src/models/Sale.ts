import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ISaleItem {
  productId: mongoose.Types.ObjectId;
  productName: string;
  sku: string;
  quantity: number;
  buyingPrice: number;
  sellingPrice: number;
  discount: number;
  total: number;
}

export interface ISale extends Document {
  saleNumber: string;
  customerId?: mongoose.Types.ObjectId;
  customerName?: string;
  items: ISaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'paystack';
  paymentStatus: 'paid' | 'pending' | 'partial';
  cashReceived: number;
  change: number;
  cashierId: mongoose.Types.ObjectId;
  branchId?: mongoose.Types.ObjectId;
  notes?: string;
  status: 'completed' | 'cancelled' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

const SaleItemSchema = new Schema<ISaleItem>({
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
  buyingPrice: {
    type: Number,
    required: true,
    min: [0, 'Buying price cannot be negative'],
  },
  sellingPrice: {
    type: Number,
    required: true,
    min: [0, 'Selling price cannot be negative'],
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative'],
  },
});

const SaleSchema = new Schema<ISale>(
  {
    saleNumber: {
      type: String,
      required: [true, 'Sale number is required'],
      unique: true,
      trim: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
    },
    customerName: {
      type: String,
      trim: true,
    },
    items: [SaleItemSchema],
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
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'partial'],
      default: 'paid',
    },
    cashReceived: {
      type: Number,
      default: 0,
      min: [0, 'Cash received cannot be negative'],
    },
    change: {
      type: Number,
      default: 0,
      min: [0, 'Change cannot be negative'],
    },
    cashierId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Cashier is required'],
    },
    branchId: {
      type: Schema.Types.ObjectId,
      ref: 'Branch',
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['completed', 'cancelled', 'refunded'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
  }
);

SaleSchema.index({ createdAt: -1 });
SaleSchema.index({ cashierId: 1 });
SaleSchema.index({ branchId: 1 });

const Sale: Model<ISale> = mongoose.models.Sale || mongoose.model<ISale>('Sale', SaleSchema);

export default Sale;
