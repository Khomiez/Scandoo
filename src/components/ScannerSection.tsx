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

  const searchProduct = async (data: string, isManualSearch: boolean = false) => {
    setPause(true);
    try {
      const response = await fetch(`/api/products/${encodeURIComponent(data)}`);
      
      if (!response.ok) {
        // If 404, product doesn't exist - this is expected, show form
        if (response.status === 404) {
          setScannedCode(data);
          setProductData(null);
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
        setScannedCode(data);
        setProductData(null);
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
      
      if (isManualSearch && props.onManualSearchComplete) {
        props.onManualSearchComplete();
      }
    } catch (error: unknown) {
      console.error("Error scanning product:", error);
      // On network error, still allow user to add product manually
      setScannedCode(data);
      setProductData(null);
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
        <Display productData={productData} scannedCode={scannedCode} onProductCreated={handleProductCreated}/>
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