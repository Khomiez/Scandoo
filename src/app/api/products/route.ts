import connectDB from "@/lib/mongo";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectDB();
    const productData = await request.json();
    const newProduct = new Product(productData);
    await newProduct.save();
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    
    // Check if it's a MongoDB connection error
    if (error instanceof Error) {
      if (error.message.includes("mongo") || error.message.includes("MongoDB") || error.message.includes("MONGO_URI")) {
        return NextResponse.json({ 
          error: "Database connection error. Please check your MongoDB configuration." 
        }, { status: 500 });
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : "Error creating product";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
