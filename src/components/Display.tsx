import { IProduct } from "@/models/Product";
import React, { useState } from "react";
import ProductForm from "./ProductForm";

type Props = {
  productData: IProduct | null | undefined;
  scannedCode: string;
  onProductCreated?: (product: IProduct) => void;
};

const Display = ({ productData, scannedCode, onProductCreated }: Props) => {
  const [showForm, setShowForm] = useState(false);

  const handleProductCreated = (product: IProduct) => {
    if (onProductCreated) {
      onProductCreated(product);
    }
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="w-[400px] h-[400px] bg-slate-200 flex flex-col items-center justify-center p-6 rounded-lg shadow-md">
      {productData ? (
        showForm ? (
          <ProductForm
            scannedCode={productData.code}
            existingProduct={productData}
            onProductCreated={handleProductCreated}
            onCancel={handleCancel}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
              Last scanned
            </p>
            <div className="flex flex-col items-center gap-2 w-full">
              <p className="text-xs text-slate-500 font-mono bg-slate-100 px-3 py-1 rounded">
                {productData.code}
              </p>
              <h1 className="text-2xl font-bold text-slate-800 text-center">
                {productData.title}
              </h1>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {productData.price.toFixed(2)}฿
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-200 active:scale-95 mt-4"
            >
              Edit Product
            </button>
          </div>
        )
      ) : (
        <>
          {scannedCode != "" ? (
            showForm ? (
              <ProductForm
                scannedCode={scannedCode}
                onProductCreated={handleProductCreated}
                onCancel={handleCancel}
              />
            ) : (
              <div className="flex flex-col items-center gap-4 w-full">
                <p className="text-xs text-slate-500 font-mono bg-slate-100 px-3 py-1 rounded">
                  {scannedCode}
                </p>
                <p className="text-slate-400 text-center">
                  This product is not in database yet
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-200 active:scale-95"
                >
                  Add New Product
                </button>
              </div>
            )
          ) : (
            <p className="text-slate-400 text-center">No product scanned yet</p>
          )}
        </>
      )}
    </div>
  );
};

export default Display;
