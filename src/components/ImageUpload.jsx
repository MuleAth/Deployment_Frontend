import React, { useState } from 'react';
import { Upload, X, Image, Check, Loader } from 'lucide-react';
import { toast } from 'react-toastify';

const ImageUpload = ({ onImageUploaded, defaultImage }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(defaultImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or WEBP)');
      return;
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setUploadSuccess(false);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setUploadSuccess(true);
        toast.success('Image uploaded successfully');
        onImageUploaded(data.imageUrl);
      } else {
        toast.error(data.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(defaultImage || null);
    setUploadSuccess(false);
    onImageUploaded(''); // Clear the image URL
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Event Image
      </label>
      
      <div className="mt-1 flex flex-col items-center">
        {/* Preview area */}
        {preview && (
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
            {uploadSuccess && (
              <div className="absolute bottom-2 right-2 bg-green-500 text-white p-1 rounded-full">
                <Check size={16} />
              </div>
            )}
          </div>
        )}
        
        {/* Upload controls */}
        <div className="flex items-center justify-center w-full">
          {!preview ? (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 5MB)</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => document.getElementById('fileInput').click()}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
              >
                <Image size={16} className="mr-2" />
                Change Image
              </button>
              
              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading || uploadSuccess}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  uploadSuccess 
                    ? 'bg-green-500 text-white' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                } ${isUploading || uploadSuccess ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isUploading ? (
                  <>
                    <Loader size={16} className="mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : uploadSuccess ? (
                  <>
                    <Check size={16} className="mr-2" />
                    Uploaded
                  </>
                ) : (
                  <>
                    <Upload size={16} className="mr-2" />
                    Upload
                  </>
                )}
              </button>
            </div>
          )}
          <input 
            id="fileInput"
            type="file" 
            className="hidden" 
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleFileChange}
          />
        </div>
      </div>
      
      <p className="mt-2 text-xs text-gray-500">
        Upload an image for your event. If none is provided, a default image will be used.
      </p>
    </div>
  );
};

export default ImageUpload;