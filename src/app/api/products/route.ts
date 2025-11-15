import connectDB from "@/lib/mongo";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await connectDB();
  try {
    const productData = await request.json();
    const newProduct = new Product(productData);
    newProduct.save();
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Error creating product" },
      { status: 400 }
    );
  }
}
