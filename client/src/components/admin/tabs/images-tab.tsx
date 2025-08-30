import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { Upload, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react'

export function ImagesTab() {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{
    success: boolean
    message: string
  } | null>(null)
  const { toast } = useToast()

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file",
        variant: "destructive"
      })
      return
    }

    setUploading(true)
    setUploadResult(null)

    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch('/api/products/upload-image', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setUploadResult({
          success: true,
          message: `Image uploaded successfully: ${data.filename}`
        })
        toast({
          title: "Success",
          description: `Image uploaded: ${data.filename}`,
        })
      } else {
        setUploadResult({
          success: false,
          message: data.message || 'Upload failed'
        })
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      setUploadResult({
        success: false,
        message: 'An error occurred during upload'
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile) {
      handleImageUpload(imageFile)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  return (
    <div className="space-y-6">
      {/* Help Text */}
      <Alert className="bg-blue-900/20 border-blue-500">
        <ImageIcon className="h-4 w-4 text-blue-400" />
        <AlertTitle className="text-blue-400">Single Image Upload</AlertTitle>
        <AlertDescription className="text-gray-300">
          Use this section to upload individual product images. Images are automatically optimized and stored in the correct directory for use in your product catalog.
        </AlertDescription>
      </Alert>

      {/* Upload Result */}
      {uploadResult && (
        <Alert className={uploadResult.success ? "bg-green-900/20 border-green-500" : "bg-red-900/20 border-red-500"}>
          {uploadResult.success ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          <AlertTitle className={uploadResult.success ? "text-green-400" : "text-red-400"}>
            {uploadResult.success ? "Upload Successful" : "Upload Failed"}
          </AlertTitle>
          <AlertDescription className="text-gray-300">
            {uploadResult.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Drag & Drop Upload Area */}
      <Card className="bg-black border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-500" />
            Upload Single Image
          </CardTitle>
          <CardDescription>
            Drag and drop an image file or click to browse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${isDragOver 
                ? 'border-blue-500 bg-blue-900/20' 
                : 'border-gray-600 hover:border-gray-500'
              }
              ${uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            {uploading ? (
              <div className="space-y-4">
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-300">Uploading image...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />
                <div className="space-y-2">
                  <p className="text-lg text-gray-300">
                    {isDragOver ? 'Drop image here' : 'Drag and drop an image'}
                  </p>
                  <p className="text-sm text-gray-500">
                    or click to browse your files
                  </p>
                  <p className="text-xs text-gray-600">
                    Supported formats: JPG, PNG, GIF, WebP (Max: 10MB)
                  </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Image
                </Button>
              </div>
            )}
          </div>
          
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
            disabled={uploading}
          />
        </CardContent>
      </Card>

      {/* Image Guidelines */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white text-sm">Image Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-400">
          <ul className="space-y-1 list-disc list-inside">
            <li>Images are automatically converted to WebP format for optimal performance</li>
            <li>Recommended size: 800x800px or higher for best quality</li>
            <li>Use clear, high-quality product photos with good lighting</li>
            <li>Images are stored in the /uploads directory</li>
            <li>Filenames are automatically generated to prevent conflicts</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}