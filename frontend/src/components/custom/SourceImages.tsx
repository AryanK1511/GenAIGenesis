// frontend/src/components/custom/SourceImages.tsx

'use client';

import { FC, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface SourceImage {
  page_number: string;
  image_path: string;
  score: number;
}

interface SourceImagesProps {
  images: SourceImage[];
}

export const SourceImages: FC<SourceImagesProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<SourceImage | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleImageError = () => {
    console.error('Image loading error');
    setImageError('Failed to load image. Please try again.');
  };

  const relevantImages = images.filter((image) => image.score >= 0.5);

  if (relevantImages.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {relevantImages.map((image, index) => (
          <div
            key={index}
            className="relative group rounded-xl overflow-hidden border border-purple-100 bg-white shadow-sm hover:shadow-lg hover:border-purple-200 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
            onClick={() => setSelectedImage(image)}
          >
            <div className="aspect-[3/4] relative">
              <Image
                src={image.image_path}
                alt={`Page ${image.page_number}`}
                fill
                className="object-cover"
                onError={handleImageError}
                priority={index < 4}
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-green-700/70 to-transparent">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white outfit-font">
                  Page {image.page_number}
                </span>
                <span className="text-xs font-medium text-purple-100">
                  {Math.round(image.score * 100)}% match
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-3xl p-0 rounded-xl overflow-hidden bg-transparent border-none backdrop-blur-sm">
          {selectedImage && (
            <div className="relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 rounded-full bg-purple-900/70 p-2.5 text-white hover:bg-purple-900/90 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={selectedImage.image_path}
                  alt={`Page ${selectedImage.page_number}`}
                  fill
                  className="object-contain"
                  onError={handleImageError}
                  priority
                  sizes="100vw"
                />
              </div>
              {imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-purple-900/80">
                  <p className="text-white text-center p-4 outfit-font">{imageError}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
