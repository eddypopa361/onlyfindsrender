import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Helmet } from "react-helmet";
import { CheckCircle, AlertCircle, Upload, FileImage, Database, Download, Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ImportPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [imagesZip, setImagesZip] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [currentStep, setCurrentStep] = useState<'csv' | 'images' | 'export'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingJson, setIsExportingJson] = useState(false);

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
        message: "Te rog să selectezi un fișier CSV pentru încărcare",
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

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
          message: data.message || "Produsele au fost importate cu succes!",
        });
        setCsvFile(null);
        // Reset file input
        const fileInput = document.getElementById("csv-file") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        
        // Move to images step if needed
        if (data.message?.includes("successfully")) {
          setTimeout(() => {
            setCurrentStep('images');
          }, 1500);
        }
      } else {
        setUploadStatus({
          success: false,
          message: data.message || "Importul produselor a eșuat",
        });
      }
    } catch (error) {
      setUploadStatus({
        success: false,
        message: "A apărut o eroare în timpul încărcării",
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
        message: "Te rog să selectezi un fișier ZIP cu imaginile produselor",
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

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
          message: data.message || "Imaginile au fost importate cu succes!",
        });
        setImagesZip(null);
        // Reset file input
        const fileInput = document.getElementById("images-zip") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        setUploadStatus({
          success: false,
          message: data.message || "Importul imaginilor a eșuat",
        });
      }
    } catch (error) {
      setUploadStatus({
        success: false,
        message: "A apărut o eroare în timpul încărcării imaginilor",
      });
      console.error("Images upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleExportStatic = async () => {
    try {
      setIsExporting(true);
      setUploadStatus(null);
      
      // Direct download approach - trigger the browser download
      window.location.href = "/api/export-static";
      
      // Show success message after a slight delay
      setTimeout(() => {
        setUploadStatus({
          success: true,
          message: "Exportul static a fost generat cu succes și descărcarea a început!",
        });
        setIsExporting(false);
      }, 3000);
      
    } catch (error) {
      console.error("Static export error:", error);
      setUploadStatus({
        success: false,
        message: "A apărut o eroare la generarea exportului static",
      });
      setIsExporting(false);
    }
  };
  
  // Funcție pentru exportul JSON static care poate fi folosit pe Netlify
  const exportToStaticJson = async () => {
    try {
      setIsExportingJson(true);
      setUploadStatus(null);
      
      const response = await fetch("/api/export-to-static-json", {
        method: "POST"
      });
      
      const data = await response.json();
      
      setUploadStatus({
        success: data.success,
        message: data.message || "Exportul JSON a fost finalizat."
      });
      
    } catch (error) {
      console.error("JSON export error:", error);
      setUploadStatus({
        success: false,
        message: "A apărut o eroare la exportul JSON: " + (error instanceof Error ? error.message : String(error))
      });
    } finally {
      setIsExportingJson(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Import Products - TJREPS Admin</title>
      </Helmet>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-white mb-6">Import Produse</h1>
        
        <Tabs 
          defaultValue="step1" 
          value={currentStep === 'csv' 
            ? 'step1' 
            : currentStep === 'images' 
              ? 'step2' 
              : 'step3'
          }
        >
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-900 border border-gray-800">
            <TabsTrigger 
              value="step1" 
              className="data-[state=active]:bg-primary/30"
              onClick={() => setCurrentStep('csv')}
            >
              <Database className="w-4 h-4 mr-2" />
              1. Import Date Produse
            </TabsTrigger>
            <TabsTrigger 
              value="step2" 
              className="data-[state=active]:bg-primary/30"
              onClick={() => setCurrentStep('images')}
            >
              <FileImage className="w-4 h-4 mr-2" />
              2. Import Imagini
            </TabsTrigger>
            <TabsTrigger 
              value="step3" 
              className="data-[state=active]:bg-primary/30"
              onClick={() => setCurrentStep('export')}
            >
              <Package className="w-4 h-4 mr-2" />
              3. Export Static
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="step1">
            <Card className="bg-black border border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Import Produse din CSV</CardTitle>
                <CardDescription>
                  Încarcă fișierul CSV cu datele produselor tale - inclusiv numele imaginilor.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentStep === 'csv' && uploadStatus && (
                  <Alert className={uploadStatus.success ? "bg-green-900/20 border-green-500 mb-4" : "bg-blue-900/20 border-blue-500 mb-4"}>
                    {uploadStatus.success ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-blue-500" />
                    )}
                    <AlertTitle className={uploadStatus.success ? "text-green-400" : "text-blue-400"}>
                      {uploadStatus.success ? "Succes" : "Eroare"}
                    </AlertTitle>
                    <AlertDescription className="text-gray-300">
                      {uploadStatus.message}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="csv-file" className="text-sm text-gray-400">
                      Fișier CSV
                    </label>
                    <Input
                      id="csv-file"
                      type="file"
                      accept=".csv"
                      onChange={handleCsvFileChange}
                      className="text-white bg-gray-900 border-gray-700"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Fișierul CSV trebuie să conțină coloanele: title, price, image, buyUrl, viewUrl, category, brand, subcategory (sau Subcategory) și featured
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
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
                  Anulează
                </Button>
                <Button 
                  onClick={handleUploadCsv} 
                  disabled={!csvFile || isUploading}
                  className="glow-button"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Se încarcă...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Încarcă CSV
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="step2">
            <Card className="bg-black border border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Import Imagini</CardTitle>
                <CardDescription>
                  Încarcă imaginile produselor într-un singur fișier ZIP. Numele fișierelor trebuie să corespundă cu cele din coloana "image" din CSV.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentStep === 'images' && uploadStatus && (
                  <Alert className={uploadStatus.success ? "bg-green-900/20 border-green-500 mb-4" : "bg-blue-900/20 border-blue-500 mb-4"}>
                    {uploadStatus.success ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-blue-500" />
                    )}
                    <AlertTitle className={uploadStatus.success ? "text-green-400" : "text-blue-400"}>
                      {uploadStatus.success ? "Succes" : "Eroare"}
                    </AlertTitle>
                    <AlertDescription className="text-gray-300">
                      {uploadStatus.message}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="images-zip" className="text-sm text-gray-400">
                      Fișier ZIP cu imagini
                    </label>
                    <Input
                      id="images-zip"
                      type="file"
                      accept=".zip"
                      onChange={handleImagesZipChange}
                      className="text-white bg-gray-900 border-gray-700"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Încarcă un fișier ZIP care conține toate imaginile produselor tale. Asigură-te că numele fișierelor corespund cu cele menționate în CSV.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
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
                  Anulează
                </Button>
                <Button 
                  onClick={handleUploadImages} 
                  disabled={!imagesZip || isUploading}
                  className="glow-button"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Se încarcă imaginile...
                    </>
                  ) : (
                    <>
                      <FileImage className="mr-2 h-4 w-4" />
                      Încarcă Imagini
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="step3">
            <Card className="bg-black border border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Export Site Static</CardTitle>
                <CardDescription>
                  Generează un export static al site-ului pentru găzduire pe Netlify sau alt serviciu de hosting static.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentStep === 'export' && uploadStatus && (
                  <Alert className={uploadStatus.success ? "bg-green-900/20 border-green-500 mb-4" : "bg-blue-900/20 border-blue-500 mb-4"}>
                    {uploadStatus.success ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-blue-500" />
                    )}
                    <AlertTitle className={uploadStatus.success ? "text-green-400" : "text-blue-400"}>
                      {uploadStatus.success ? "Succes" : "Eroare"}
                    </AlertTitle>
                    <AlertDescription className="text-gray-300">
                      {uploadStatus.message}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    {/* Export JSON */}
                    <div className="bg-blue-900/20 p-4 rounded border border-blue-700">
                      <h3 className="font-medium text-white mb-2 flex items-center">
                        <Download className="h-4 w-4 mr-2" />
                        Export Produse ca JSON
                      </h3>
                      <p className="text-sm text-gray-300 mb-3">
                        Exportă toate produsele într-un fișier JSON pentru a le include în build-ul static Netlify.
                      </p>
                      <div className="bg-black/30 p-3 rounded text-sm">
                        <ul className="list-disc pl-5 space-y-1 text-gray-400">
                          <li>Include toate produsele din baza de date</li>
                          <li>Format JSON compatibil cu orice frontend</li>
                          <li>Descarcă direct pe computerul tău</li>
                          <li>Păstrează toate detaliile produselor</li>
                        </ul>
                      </div>
                      <div className="mt-3 text-center">
                        <a 
                          href="/api/products-export" 
                          className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium"
                        >
                          Descarcă JSON
                        </a>
                      </div>
                    </div>
                    
                    {/* Export Static Site */}
                    <div className="bg-primary/20 p-4 rounded border border-primary">
                      <h3 className="font-medium text-white mb-2 flex items-center">
                        <Download className="h-4 w-4 mr-2" />
                        Export Static pentru Netlify
                      </h3>
                      <p className="text-sm text-gray-300 mb-3">
                        Aceasta va genera un export static al site-ului cu toate produsele și imaginile, 
                        optimizat pentru încărcare pe Netlify sau orice serviciu de găzduire statică.
                      </p>
                      <div className="bg-black/30 p-3 rounded text-sm">
                        <ul className="list-disc pl-5 space-y-1 text-gray-400">
                          <li>Include toate produsele din baza de date (până la 5000)</li>
                          <li>Include toate imaginile produselor</li>
                          <li>Funcționează fără bază de date sau server</li>
                          <li>Păstrează designul și aspectul site-ului</li>
                          <li>Export optimizat pentru Netlify și alte platforme statice</li>
                        </ul>
                      </div>
                      <div className="mt-3 text-center">
                        <Button 
                          onClick={exportToStaticJson}
                          disabled={isExportingJson}
                          className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded text-sm font-medium"
                        >
                          {isExportingJson ? (
                            <div className="flex items-center">
                              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                              <span>Se exportă JSON...</span>
                            </div>
                          ) : (
                            <span>Generează JSON Static</span>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-xs text-gray-500">
                  Exportul poate dura câteva minute, în funcție de numărul de produse
                </div>
                <Button 
                  onClick={handleExportStatic} 
                  disabled={isExporting}
                  className="glow-button"
                >
                  {isExporting ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Se generează exportul...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Generează Export Static
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Instrucțiuni Import</h2>
          <Card className="bg-black border border-gray-800">
            <CardContent className="pt-6">
              <div className="text-sm text-gray-400 space-y-4">
                <div>
                  <h3 className="font-medium text-white mb-2">Pasul 1: Pregătirea CSV-ului</h3>
                  <p>Fișierul CSV trebuie să conțină următoarele coloane:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li><strong>title</strong> - Numele produsului (obligatoriu)</li>
                    <li><strong>price</strong> - Prețul ca text, ex. "299.99" (obligatoriu)</li>
                    <li><strong>image</strong> - Numele fișierului imagine, ex. "image4.png" (obligatoriu)</li>
                    <li><strong>buyUrl</strong> - URL-ul pentru cumpărare (obligatoriu)</li>
                    <li><strong>viewUrl</strong> - URL-ul pentru vizualizare (obligatoriu)</li>
                    <li><strong>category</strong> - Categoria produsului, ex. "Shoes", "Clothing" (obligatoriu)</li>
                    <li><strong>brand</strong> - Brand-ul produsului, ex. "Nike", "Adidas"</li>
                    <li><strong>subcategory</strong> - Subcategoria, ex. "T-Shirts", "Hoodies" pentru Clothing sau "Eyewear" pentru Accessories</li>
                    <li><strong>featured</strong> - "true" sau "1" pentru produsele promovate</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-white mb-2">Pasul 2: Pregătirea imaginilor</h3>
                  <p>Pentru a importa imaginile extrase din Excel:</p>
                  <ol className="list-decimal pl-5 space-y-1 mt-2">
                    <li>Extrage Excel-ul ca .xlsx</li>
                    <li>Redenumește fișierul în .zip și dezarhivează-l</li>
                    <li>În folderul dezarhivat, găsește folderul "media" care conține imaginile</li>
                    <li>Arhivează toate imaginile într-un nou fișier ZIP</li>
                    <li>Încarcă acest ZIP în pasul 2 al procesului de import</li>
                  </ol>
                </div>
                
                <div className="bg-primary/20 p-3 rounded border border-primary mt-4">
                  <h3 className="font-medium text-white mb-1">Sfat Pro</h3>
                  <p>Folosește scriptul nostru pentru a extrage automat numele imaginilor din Excel:</p>
                  <pre className="bg-black/50 p-2 rounded mt-1 overflow-x-auto">
                    node scripts/extract-excel-images.js cale/catre/fisier.xlsx
                  </pre>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium text-white mb-2">Pasul 3: Export Static pentru Netlify</h3>
                  <p>Pentru a exporta site-ul static pentru Netlify:</p>
                  <ol className="list-decimal pl-5 space-y-1 mt-2">
                    <li>Accesează tab-ul "Export Static" din panoul de administrare</li>
                    <li>Apasă butonul "Generează Export Static" pentru a crea arhiva ZIP</li>
                    <li>Descarcă arhiva ZIP generată care conține tot site-ul static</li>
                    <li>Dezarhivează acest fișier pe calculatorul tău</li>
                    <li>Încarcă folderul dezarhivat pe Netlify prin drag-and-drop sau prin Git</li>
                  </ol>
                  <p className="text-xs text-primary mt-2">Notă: Exportul static va include toate produsele și imaginile, funcționând complet fără server sau bază de date.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}