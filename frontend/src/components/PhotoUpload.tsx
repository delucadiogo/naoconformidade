import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhotoUploadProps {
  onPhotosChange: (files: File[]) => void;
  photos: File[];
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotosChange, photos }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newPhotos = [...photos, ...acceptedFiles].slice(0, 5); // Limita a 5 fotos
    onPhotosChange(newPhotos);
  }, [photos, onPhotosChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          <Image className="h-8 w-8 text-gray-400" />
          {isDragActive ? (
            <p className="text-sm text-gray-600">Solte as fotos aqui...</p>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                Arraste e solte fotos aqui, ou clique para selecionar
              </p>
              <p className="text-xs text-gray-500">
                Máximo de 5 fotos, 5MB cada. JPG, PNG ou GIF
              </p>
            </>
          )}
        </div>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(photo)}
                alt={`Foto ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removePhoto(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoUpload; 