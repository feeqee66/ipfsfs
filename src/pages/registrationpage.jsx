'use client';

import React, { useState } from "react";
import { PinataSDK } from "pinata-web3";


function ContractUploadPage() {
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setError(null);

    const pinata = new PinataSDK({
      pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT, // Loaded from environment variable
      pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
    });

    try {
      const upload = await pinata.upload.file(file);
      console.log("File uploaded to IPFS:", upload);
      setFileURL(`https://gateway.pinata.cloud/ipfs/${upload.IpfsHash}`);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to upload file. Please check your JWT or file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Upload Contract</h1>
        <p className="text-gray-600 mb-6">
          Upload your contract securely to IPFS with ease.
        </p>

        <div className="mb-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <button
          onClick={handleFileUpload}
          disabled={loading}
          className={`w-full p-2 rounded bg-green-500 text-white font-bold ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
          }`}
        >
          {loading ? "Uploading..." : "Upload to IPFS"}
        </button>

        {fileURL && (
          <div className="mt-6">
            <h2 className="text-green-700 font-bold">File uploaded successfully!</h2>
            <a
              href={fileURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline mt-2 block"
            >
              {fileURL}
            </a>
          </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}

export default ContractUploadPage;
