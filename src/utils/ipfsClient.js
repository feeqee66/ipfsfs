const handleFileUpload = async () => {
  if (!file) {
    setError("Please select a file first");
    return;
  }

  setLoading(true);
  setError(null);

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        "pinata_api_key": process.env.NEXT_PUBLIC_PINATA_API_KEY, // Replace with your Pinata API Key
        "pinata_secret_api_key": process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY, // Replace with your Pinata API Secret
      },
      body: formData, // formData containing the file
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Error uploading file: ${errorText}`);
    }

    const result = await response.json();
    console.log("File uploaded to IPFS:", result);
    setFileURL(`https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`);

  } catch (error) {
    console.error("Error:", error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
