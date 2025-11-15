import connectDB from "@/lib/mongo";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: "Product code is required" }, { status: 400 });
    }

    const product = await Product.findOne({ code: id });
    if (!product) {
      return NextResponse.json({ error: "product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error in GET /api/products/[id]:", error);
    
    // Check if it's a MongoDB connection error
    if (error instanceof Error) {
      if (error.message.includes("mongo") || error.message.includes("MongoDB") || error.message.includes("MONGO_URI")) {
        return NextResponse.json({ 
          error: "Database connection error. Please check your MongoDB configuration." 
        }, { status: 500 });
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : "Error fetching product";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    
    const body = await request.json();
    const { title, code, price } = body;

    const product = await Product.findOneAndUpdate(
      { code: id },
      { title, code, price },
      { new: true, runValidators: true }
    );

    if (!product) {
      return NextResponse.json({ error: "product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error in PUT /api/products/[id]:", error);
    
    // Check if it's a MongoDB connection error
    if (error instanceof Error) {
      if (error.message.includes("mongo") || error.message.includes("MongoDB") || error.message.includes("MONGO_URI")) {
        return NextResponse.json({ 
          error: "Database connection error. Please check your MongoDB configuration." 
        }, { status: 500 });
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : "Error updating product";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}