import { useState } from "react";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [targetSize, setTargetSize] = useState(50); // in KB
  const [compressedImage, setCompressedImage] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [loading, setLoading] = useState(false);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setOriginalSize((file.size / 1024).toFixed(2));
      setCompressedImage(null);
    }
  };

  // Compress with ~600 ms simulated server response
  const handleCompress = async () => {
    if (!image) return;
    setLoading(true);

    const img = new Image();
    img.src = preview;
    await new Promise((resolve) => (img.onload = resolve));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    let quality = 0.9;
    let blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", quality));

    // Adjust quality until near target size
    while (blob.size / 1024 > targetSize && quality > 0.05) {
      quality -= 0.05;
      blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", quality));
    }

    // Simulate 600 ms "server" latency for realism
    await new Promise((r) => setTimeout(r, 600));

    setCompressedSize((blob.size / 1024).toFixed(2));
    const compressedURL = URL.createObjectURL(blob);
    setCompressedImage(compressedURL);
    setLoading(false);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = compressedImage;
    link.download = `compressed-${targetSize}KB.jpg`;
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <header className="bg-white/80 backdrop-blur shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-center">
          <h1 className="text-2xl font-bold  text-blue-600">ImageCompressor.io</h1>
          <nav className="hidden md:flex space-x-6 text-gray-600 font-medium">
       
          </nav>
        </div>
      </header>

      {/* Hero Banner */}
      <section
        className="relative bg-cover bg-center h-[65vh] flex items-center justify-center"
        style={{ backgroundImage: "url('/banner.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient from-blue-800/70 to-indigo-600/70"></div>
        <div className="relative z-10 text-center text-black px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
            Compress Images Smartly & Fast
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 opacity-90">
            Shrink your images to 20 KB, 50 KB, or 100 KB without losing clarity — all directly in your browser.
          </p>
          <a
            href="#tool"
            className="inline-block bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition"
          >
            Try It Now ↓
          </a>
        </div>
      </section>

      {/* Main Tool Section */}
      <section id="tool" className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <h3 className="text-3xl font-semibold text-center text-gray-800 mb-8">
            🗜️ Online Image Compressor
          </h3>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Upload Area */}
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border border-gray-300 rounded-lg p-3 cursor-pointer hover:border-blue-500 transition"
              />

              {preview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">
                    Original Size: <strong>{originalSize} KB</strong>
                  </p>
                  <img
                    src={preview}
                    alt="Preview"
                    className="rounded-lg shadow w-full h-auto"
                  />
                </div>
              )}

              <div className="mt-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Choose Target Size (KB)
                </label>
                <select
                  value={targetSize}
                  onChange={(e) => setTargetSize(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg p-3"
                >
                  <option value="20">20 KB</option>
                  <option value="50">50 KB</option>
                  <option value="100">100 KB</option>
                </select>
              </div>

              <button
                onClick={handleCompress}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition font-semibold"
              >
                {loading ? "Compressing…" : "Compress Image"}
              </button>

              {loading && (
                <div className="flex justify-center mt-4">
                  <div className="h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Result Area */}
            {compressedImage && (
              <div className="flex-1 text-center md:border-l border-gray-200 md:pl-8">
                <h4 className="text-xl font-semibold text-gray-700 mb-2">
                  Compressed Result
                </h4>
                <p className="text-sm text-gray-500 mb-3">
                  Final Size: <strong>{compressedSize} KB</strong>
                </p>
                <img
                  src={compressedImage}
                  alt="Compressed"
                  className="rounded-lg shadow w-full h-auto mb-4"
                />
                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Download Image
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-blue-600 text-white text-center py-16 px-6">
        <h3 className="text-3xl font-bold mb-4">Why Choose ImageCompressor.io?</h3>
        <p className="max-w-3xl mx-auto text-lg opacity-90">
          Our algorithm ensures the perfect balance between quality and file size — reducing your image sizes instantly,
          without uploading to any server. Your files never leave your device.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6 mt-auto">
        <p className="text-sm">
          © {new Date().getFullYear()} ImageCompressor.io — Built with ❤️ using React + Vite + Tailwind CSS
        </p>
      </footer>
    </div>
  );
}

export default App;
