'use server';

import connectDB from '@/lib/mongodb';
import { Sale, Product, Expense, Customer, AIReport } from '@/models';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { serialize } from '@/lib/serialize';

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

export async function getBusinessInsights(query: string, userId: string) {
  await connectDB();

  // Fetch relevant business data
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const monthlySales = await Sale.find({
    createdAt: { $gte: monthStart },
    status: 'completed'
  });
  
  const monthlyRevenue = monthlySales.reduce((sum, sale) => sum + sale.total, 0);
  const monthlyProfit = monthlySales.reduce((sum, sale) => {
    const cost = sale.items.reduce((itemSum, item) => itemSum + (item.buyingPrice * item.quantity), 0);
    return sum + (sale.total - cost);
  }, 0);
  
  const monthlyExpenses = await Expense.find({
    date: { $gte: monthStart }
  });
  const totalExpenses = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const lowStockProducts = await Product.find({
    stockQuantity: { $lte: 10 },
    isActive: true
  });
  
  const expiringProducts = await Product.find({
    expiryDate: { $lte: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) },
    isActive: true
  });
  
  const topProducts = await Sale.aggregate([
    { $match: { createdAt: { $gte: monthStart }, status: 'completed' } },
    { $unwind: '$items' },
    { $group: { _id: '$items.productId', totalSold: { $sum: '$items.quantity' }, revenue: { $sum: '$items.total' } } },
    { $sort: { totalSold: -1 } },
    { $limit: 5 }
  ]);

  // Prepare context for AI
  const context = {
    monthlyRevenue,
    monthlyProfit,
    totalExpenses,
    netProfit: monthlyProfit - totalExpenses,
    totalSales: monthlySales.length,
    lowStockCount: lowStockProducts.length,
    expiringCount: expiringProducts.length,
    topProducts: topProducts.map(p => ({
      productId: p._id,
      totalSold: p.totalSold,
      revenue: p.revenue
    })),
    lowStockProducts: lowStockProducts.map(p => ({
      name: p.name,
      stockQuantity: p.stockQuantity
    })),
    expiringProducts: expiringProducts.map(p => ({
      name: p.name,
      expiryDate: p.expiryDate
    }))
  };

  // Generate AI response
  const prompt = `You are an AI business assistant for a supermarket. Here's the current business data:
  
  Monthly Revenue: $${context.monthlyRevenue.toFixed(2)}
  Monthly Profit: $${context.monthlyProfit.toFixed(2)}
  Total Expenses: $${context.totalExpenses.toFixed(2)}
  Net Profit: $${context.netProfit.toFixed(2)}
  Total Sales: ${context.totalSales}
  Low Stock Products: ${context.lowStockCount}
  Expiring Products: ${context.expiringCount}
  
  Top Selling Products: ${context.topProducts.map(p => `${p.productId} (${p.totalSold} sold, $${p.revenue.toFixed(2)})`).join(', ')}
  
  Low Stock Items: ${context.lowStockProducts.map(p => `${p.name} (${p.stockQuantity} units)`).join(', ')}
  Expiring Items: ${context.expiringProducts.map(p => `${p.name} (expires: ${p.expiryDate})`).join(', ')}
  
  User Question: ${query}
  
  Provide a helpful, actionable response based on this data. Focus on business insights, recommendations, and specific actions the owner can take.`;

  try {
    // Check if API key is configured
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY is not configured in environment variables');
    }

    console.log('[Gemini API] Sending request to Google Gemini AI...');
    console.log('[Gemini API] Query:', query);
    console.log('[Gemini API] Context:', JSON.stringify(context, null, 2));

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    console.log('[Gemini API] Response received successfully');
    console.log('[Gemini API] Response length:', response.length);

    // Save the AI report
    await AIReport.create({
      title: query.substring(0, 50) + '...',
      type: 'business_insight',
      query,
      response,
      data: context,
      confidence: 85,
      generatedBy: userId,
      tags: ['insight', 'analysis'],
    });

    return {
      success: true,
      response,
      data: context,
      model: 'gemini-1.5-pro',
    };
  } catch (error: any) {
    console.error('[Gemini API] Error:', error);
    
    // Detailed error logging
    if (error.message.includes('API key')) {
      console.error('[Gemini API] API Key Error: Invalid or missing API key');
      return {
        success: false,
        error: 'Invalid or missing Google AI API key. Please check your environment configuration.',
        details: 'Ensure GOOGLE_AI_API_KEY is set in your .env.local file',
      };
    }
    
    if (error.message.includes('quota') || error.message.includes('429')) {
      console.error('[Gemini API] Quota Error: API quota exceeded');
      return {
        success: false,
        error: 'API quota exceeded. Please check your Google AI Studio quota.',
        details: error.message,
      };
    }

    return {
      success: false,
      error: 'Failed to generate AI response',
      details: error.message,
    };
  }
}

export async function getAIReports(userId?: string) {
  await connectDB();

  const query = userId ? { generatedBy: userId } : {};
  const reports = await AIReport.find(query)
    .sort({ createdAt: -1 })
    .limit(20);

  return serialize(reports);
}

export async function predictSales(productId: string, days: number = 30) {
  await connectDB();

  // Get historical sales data for the product
  const historicalSales = await Sale.aggregate([
    { $match: { status: 'completed' } },
    { $unwind: '$items' },
    { $match: { 'items.productId': productId } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        totalSold: { $sum: '$items.quantity' },
        revenue: { $sum: '$items.total' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    { $limit: 90 }
  ]);

  // Simple prediction based on average
  const avgDailySales = historicalSales.length > 0
    ? historicalSales.reduce((sum, s) => sum + s.totalSold, 0) / historicalSales.length
    : 0;

  const predictedSales = Math.round(avgDailySales * days);
  const predictedRevenue = predictedSales * 10; // Assuming avg price of $10

  return {
    productId,
    days,
    predictedSales,
    predictedRevenue,
    confidence: 70,
    historicalData: historicalSales,
  };
}
