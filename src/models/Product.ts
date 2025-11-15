import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  code: string;
  price: number;
}

const ProductSchema = new Schema<IProduct>({
    title: {type: String, required: true},
    code: {type: String, required: true},
    price: {type: Number, required: true},
});

export default mongoose.models.Product || mongoose.model<IProduct>("Products", ProductSchema);