import { centerText, Scanner } from "@yudiel/react-qr-scanner";
import { useState, useEffect } from "react";
import Display from "./Display";
import { IProduct } from "@/models/Product";

type Props = {
    deviceId: string;
    manualSearchCode?: string;
    searchTrigger?: number;
    onManualSearchComplete?: () => void;
};

const ScannerSection = (props: Props) => {

  const [pause, setPause] = useState(false);
  const [productData, setProductData] = useState<IProduct | null>();
  const [scannedCode, setScannedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchProduct = async (data: string, isManualSearch: boolean = false) => {
    setPause(true);
    setIsLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await fetch(`/api/products/${encodeURIComponent(data)}`);
      
      if (!response.ok) {
        // If 404, product doesn't exist - this is expected, show form
        if (response.status === 404) {
          setScannedCode(data);
          setProductData(null);
          setIsLoading(false);
          if (isManualSearch && props.onManualSearchComplete) {
            props.onManualSearchComplete();
          }
          return;
        }
        // For other errors, try to parse error message
        let errorMessage = `Server error (${response.status})`;
        try {
          const errorResult = await response.json();
          errorMessage = errorResult?.error || errorMessage;
          console.error("API Error:", errorResult);
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
        }
        console.error("API Error - Status:", response.status, "Message:", errorMessage);
        
        // For 500 errors, show the error message
        if (response.status === 500) {
          setError(errorMessage);
        }
        
        setScannedCode(data);
        setProductData(null);
        setIsLoading(false);
        if (isManualSearch && props.onManualSearchComplete) {
          props.onManualSearchComplete();
        }
        return;
      }

      const result = await response.json();

      if (result.error) {
        setScannedCode(data);
        setProductData(null);
      } else {
        setProductData(result);
        setScannedCode('');
      }
      
      setIsLoading(false);
      if (isManualSearch && props.onManualSearchComplete) {
        props.onManualSearchComplete();
      }
    } catch (error: unknown) {
      console.error("Error scanning product:", error);
      const errorMessage = error instanceof Error ? error.message : "Network error occurred";
      setError(errorMessage);
      // On network error, still allow user to add product manually
      setScannedCode(data);
      setProductData(null);
      setIsLoading(false);
      if (isManualSearch && props.onManualSearchComplete) {
        props.onManualSearchComplete();
      }
    }
  };

  const handleScan = async (data: string) => {
    await searchProduct(data);
  };

  // Handle manual search from parent component
  useEffect(() => {
    if (props.searchTrigger && props.searchTrigger > 0 && props.manualSearchCode && props.manualSearchCode.trim()) {
      searchProduct(props.manualSearchCode.trim(), true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.searchTrigger]);

  const handleProductCreated = (product: IProduct) => {
    setProductData(product);
    setScannedCode('');
  };

  return (
    <div className="flex flex-col justify-center items-center">
      {!pause ? 
        <Scanner
          formats={[
            "qr_code",
            "micro_qr_code",
            "rm_qr_code",
            "maxi_code",
            "pdf417",
            "aztec",
            "data_matrix",
            "matrix_codes",
            "dx_film_edge",
            "databar",
            "databar_expanded",
            "codabar",
            "code_39",
            "code_93",
            "code_128",
            "ean_8",
            "ean_13",
            "itf",
            "linear_codes",
            "upc_a",
            "upc_e",
          ]}
          constraints={{
            deviceId: props.deviceId,
          }}
          onScan={(detectedCodes) => {
            handleScan(detectedCodes[0].rawValue);
          }}
          onError={(error) => {
            console.log(`onError: ${error}'`);
          }}
          styles={{
            container: {
              height: "400px",
              width: "400px",
              border: "5px solid rgb(48, 245, 252)",
              backgroundColor: "slategray",
            },
            video: {},
          }}
          components={{
            onOff: false,
            torch: true,
            zoom: true,
            finder: true,
            tracker: centerText,
          }}
          allowMultiple={false}
          scanDelay={2000}
          paused={pause}
        /> 
        : // if the scanner is off
        isLoading ? (
          <div className="w-[400px] h-[400px] bg-slate-200 flex flex-col items-center justify-center p-6 rounded-lg shadow-md">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-slate-600 font-medium">Loading product data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="w-[400px] h-[400px] bg-slate-200 flex flex-col items-center justify-center p-6 rounded-lg shadow-md">
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-red-600 font-semibold text-lg">Error</p>
              <p className="text-slate-700 text-sm">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setPause(false);
                }}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-200 active:scale-95"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <Display productData={productData} scannedCode={scannedCode} onProductCreated={handleProductCreated}/>
        )
      }
      <button 
        onClick={() => setPause(!pause)}
        className={`mt-6 font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-200 active:scale-95 ${
          pause 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-slate-500 hover:bg-slate-600 text-white'
        }`}
      >
        {pause ? 'Resume Scanner' : 'Done Scanning'}
      </button>
    </div>
  );
};


export default ScannerSection;