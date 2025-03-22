import { FC, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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

  console.log(images);

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-slate-700 mb-3">Source Pages</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            <div className="aspect-[3/4] relative">
              <Image
                src={image.image_path}
                alt={`Page ${image.page_number}`}
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white">Page {image.page_number}</span>
                <span className="text-xs text-white/80">
                  {Math.round(image.score * 100)}% match
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0">
          {selectedImage && (
            <div className="relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={`/api/images/${selectedImage.image_path.split('/').pop()}`}
                  alt={`Page ${selectedImage.page_number}`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
