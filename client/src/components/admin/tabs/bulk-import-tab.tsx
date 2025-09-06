import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Upload, FileImage, Database } from "lucide-react";

export function BulkImportTab() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [imagesZip, setImagesZip] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [activeStep, setActiveStep] = useState<'csv' | 'images'>('csv');

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setCsvFile(selectedFile);
    setUploadStatus(null);
  };

  const handleImagesZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setImagesZip(selectedFile);
    setUploadStatus(null);
  };

  const handleUploadCsv = async () => {
    if (!csvFile) {
      setUploadStatus({
        success: false,
        message: "Please select a CSV file to upload",
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);
    setActiveStep('csv');

    const formData = new FormData();
    formData.append("file", csvFile);

    try {
      const response = await fetch("/api/products/import/csv", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadStatus({
          success: true,
          message: data.message || "Products imported successfully!",
        });
        setCsvFile(null);
        // Reset file input
        const fileInput = document.getElementById("csv-file") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        
        // Keep the success message in the CSV import section
        // Auto-navigation to images step removed for better UX
      } else {
        setUploadStatus({
          success: false,
          message: data.message || "Product import failed",
        });
      }
    } catch (error) {
      setUploadStatus({
        success: false,
        message: "An error occurred during upload",
      });
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadImages = async () => {
    if (!imagesZip) {
      setUploadStatus({
        success: false,
        message: "Please select a ZIP file with product images",
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);
    setActiveStep('images');

    const formData = new FormData();
    formData.append("imagesZip", imagesZip);

    try {
      const response = await fetch("/api/products/import/images", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadStatus({
          success: true,
          message: data.message || "Images imported successfully!",
        });
        setImagesZip(null);
        // Reset file input
        const fileInput = document.getElementById("images-zip") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        setUploadStatus({
          success: false,
          message: data.message || "Image import failed",
        });
      }
    } catch (error) {
      setUploadStatus({
        success: false,
        message: "An error occurred during image upload",
      });
      console.error("Images upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Help Text */}
      <Alert className="bg-blue-900/20 border-blue-500">
        <Database className="h-4 w-4 text-blue-400" />
        <AlertTitle className="text-blue-400">Bulk Import Guide</AlertTitle>
        <AlertDescription className="text-gray-300 space-y-2">
          <p>Use this section to import multiple products at once:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>First, upload a CSV file with product data</li>
            <li>Then, upload a ZIP file containing product images</li>
            <li>Image filenames in the ZIP must match the 'image' column in your CSV</li>
          </ol>
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        {/* CSV Import */}
        <Card className="bg-black border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-500" />
              Import Product Data
            </CardTitle>
            <CardDescription>
              Upload a CSV file containing product information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeStep === 'csv' && uploadStatus && (
              <Alert className={uploadStatus.success ? "bg-green-900/20 border-green-500" : "bg-red-900/20 border-red-500"}>
                {uploadStatus.success ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <AlertTitle className={uploadStatus.success ? "text-green-400" : "text-red-400"}>
                  {uploadStatus.success ? "Success" : "Error"}
                </AlertTitle>
                <AlertDescription className="text-gray-300">
                  {uploadStatus.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="csv-file" className="text-sm text-gray-400">
                CSV File
              </label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleCsvFileChange}
                className="text-white bg-gray-900 border-gray-700"
              />
              <p className="text-xs text-gray-500">
                Required columns: title, price_usd, image, buy_url, category, sub_category, featured, carousel
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="text-gray-400 border-gray-700"
                onClick={() => {
                  setCsvFile(null);
                  setUploadStatus(null);
                  const fileInput = document.getElementById("csv-file") as HTMLInputElement;
                  if (fileInput) fileInput.value = "";
                }}
              >
                Clear
              </Button>
              <Button 
                onClick={handleUploadCsv} 
                disabled={!csvFile || isUploading}
                className="bg-blue-600 hover:bg-blue-700 flex-1"
              >
                {isUploading && activeStep === 'csv' ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload CSV
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Images Import */}
        <Card className="bg-black border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileImage className="h-5 w-5 text-blue-500" />
              Import Product Images
            </CardTitle>
            <CardDescription>
              Upload a ZIP file containing all product images
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeStep === 'images' && uploadStatus && (
              <Alert className={uploadStatus.success ? "bg-green-900/20 border-green-500" : "bg-red-900/20 border-red-500"}>
                {uploadStatus.success ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <AlertTitle className={uploadStatus.success ? "text-green-400" : "text-red-400"}>
                  {uploadStatus.success ? "Success" : "Error"}
                </AlertTitle>
                <AlertDescription className="text-gray-300">
                  {uploadStatus.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="images-zip" className="text-sm text-gray-400">
                ZIP File with Images
              </label>
              <Input
                id="images-zip"
                type="file"
                accept=".zip"
                onChange={handleImagesZipChange}
                className="text-white bg-gray-900 border-gray-700"
              />
              <p className="text-xs text-gray-500">
                Upload a ZIP file containing all product images. Filenames must match the 'image' column in your CSV.
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="text-gray-400 border-gray-700"
                onClick={() => {
                  setImagesZip(null);
                  setUploadStatus(null);
                  const fileInput = document.getElementById("images-zip") as HTMLInputElement;
                  if (fileInput) fileInput.value = "";
                }}
              >
                Clear
              </Button>
              <Button 
                onClick={handleUploadImages} 
                disabled={!imagesZip || isUploading}
                className="bg-blue-600 hover:bg-blue-700 flex-1"
              >
                {isUploading && activeStep === 'images' ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FileImage className="mr-2 h-4 w-4" />
                    Upload Images
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}