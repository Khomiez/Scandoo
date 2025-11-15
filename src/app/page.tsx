"use client";

import { useState } from "react";
import { useDevices } from "@yudiel/react-qr-scanner";
import ScannerSection from "@/components/ScannerSection";

export default function ScannerPage() {
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [manualSearchCode, setManualSearchCode] = useState<string>("");
  const [searchTrigger, setSearchTrigger] = useState<number>(0);
  const [isSearching, setIsSearching] = useState(false);

  const devices = useDevices();

  const handleManualSearch = () => {
    if (!manualSearchCode.trim()) {
      return;
    }
    setIsSearching(true);
    // Trigger search by updating the trigger timestamp
    setSearchTrigger(Date.now());
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleManualSearch();
    }
  };

  return (
    <div className="flex flex-col items-center max-h-screen p-6 bg-slate-50">
      <div className="w-full max-w-md mb-6">
        <label
          htmlFor="device-select"
          className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide"
        >
          Camera Device
        </label>
        <select
          id="device-select"
          value={deviceId || ""}
          onChange={(e) => setDeviceId(e.target.value || undefined)}
          className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-slate-400 cursor-pointer"
        >
          <option value="">Select a camera device</option>
          {devices.map((device, index) => (
            <option key={index} value={device.deviceId}>
              {device.label || `Camera ${index + 1}`}
            </option>
          ))}
        </select>
        {devices.length === 0 && (
          <p className="mt-2 text-xs text-slate-500 italic">
            No cameras detected. Please check your device permissions.
          </p>
        )}
      </div>
      <div className="w-full max-w-md mb-6">
        <label
          htmlFor="manual-search"
          className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide"
        >
          Manual Search
        </label>
        <div className="flex gap-2">
          <input
            id="manual-search"
            type="text"
            value={manualSearchCode}
            onChange={(e) => setManualSearchCode(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter product code"
            className="flex-1 px-4 py-3 bg-white border-2 border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-slate-400"
            disabled={isSearching}
          />
          <button
            onClick={handleManualSearch}
            disabled={isSearching || !manualSearchCode.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 active:scale-95 whitespace-nowrap"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      <ScannerSection 
        deviceId={deviceId || ""} 
        manualSearchCode={manualSearchCode}
        searchTrigger={searchTrigger}
        onManualSearchComplete={() => {
          setIsSearching(false);
        }}
      />
    </div>
  );
}
