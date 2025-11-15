import { IProduct } from "@/models/Product";
import React, { useState } from "react";

type Props = {
  scannedCode: string;
  onProductCreated: (product: IProduct) => void;
  onCancel: () => void;
  existingProduct?: IProduct | null;
};

const ProductForm = ({ scannedCode, onProductCreated, onCancel, existingProduct }: Props) => {
  const isEditMode = !!existingProduct;
  const [formData, setFormData] = useState({
    title: existingProduct?.title || "",
    code: existingProduct?.code || scannedCode,
    price: existingProduct?.price.toString() || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (existingProduct) {
      setFormData({
        title: existingProduct.title,
        code: existingProduct.code,
        price: existingProduct.price.toString(),
      });
    } else {
      setFormData((prev) => ({ ...prev, code: scannedCode }));
    }
  }, [scannedCode, existingProduct]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validation
    if (!formData.title.trim()) {
      setError("Title is required");
      setIsSubmitting(false);
      return;
    }
    if (!formData.code.trim()) {
      setError("Code is required");
      setIsSubmitting(false);
      return;
    }
    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      setError("Please enter a valid price");
      setIsSubmitting(false);
      return;
    }

    try {
      const url = isEditMode 
        ? `/api/products/${existingProduct?.code}`
        : "/api/products";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          code: formData.code.trim(),
          price: price,
        }),
      });

      if (!response.ok) {
        throw new Error(isEditMode ? "Failed to update product" : "Failed to create product");
      }

      const updatedProduct = await response.json();
      onProductCreated(updatedProduct);
      if (!isEditMode) {
        setFormData({ title: "", code: scannedCode, price: "" });
      }
    } catch (err) {
      setError(isEditMode ? "Error updating product. Please try again." : "Error creating product. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full h-full justify-center"
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor="code"
          className="text-xs font-semibold text-slate-600 uppercase tracking-wide"
        >
          Product Code
        </label>
        <input
          type="text"
          id="code"
          name="code"
          value={formData.code}
          onChange={handleInputChange}
          className="px-3 py-2 rounded border border-slate-300 bg-white text-slate-800 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          readOnly
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="title"
          className="text-xs font-semibold text-slate-600 uppercase tracking-wide"
        >
          Product Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="px-3 py-2 rounded border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter product name"
          required
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="price"
          className="text-xs font-semibold text-slate-600 uppercase tracking-wide"
        >
          Price (฿) *
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          className="px-3 py-2 rounded border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="0.00"
          step="0.01"
          min="0"
          required
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
          {error}
        </p>
      )}

      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-slate-400 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 active:scale-95"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update Product" : "Save Product")}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;

