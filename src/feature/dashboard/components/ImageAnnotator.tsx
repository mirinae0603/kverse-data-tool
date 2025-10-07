import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { CircleX, ClosedCaption } from 'lucide-react';
import { Spinner } from '@/components/ui/shadcn-io/spinner';

type CroppedItem = {
    src: string;
    label: string;
    relativeCrop: Crop;
};

type ImageItem = {
    id: string;
    url: string;
};

const LABEL_OPTIONS = ['Person', 'Car', 'Animal', 'Other'];

const ImageCropAnnotator: React.FC = () => {
    const [images, setImages] = useState<ImageItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [crop, setCrop] = useState<Crop>({ unit: '%', width: 30, height: 30, x: 0, y: 0 });
    const [croppedImagesMap, setCroppedImagesMap] = useState<Record<string, CroppedItem[]>>({});
    const [selectedLabel, setSelectedLabel] = useState('');
    const [customLabel, setCustomLabel] = useState('');
    const imageRef = useRef<HTMLImageElement | null>(null);

    // Fetch images (dummy data for now)
    useEffect(() => {
        const fetchImages = async () => {
            // Simulate API call
            const fetchedImages: ImageItem[] = Array.from({ length: 5 }, (_, i) => ({
                id: (i + 1).toString(),
                url: `https://picsum.photos/800/500?random=${i + 1}`,
            }));
            setImages(fetchedImages);
        };
        fetchImages();
    }, []);

    const currentImage = images[currentIndex];

    // Generate cropped image using relative coordinates
    const makeClientCrop = useCallback(async (crop: Crop) => {
        if (imageRef.current && crop.width && crop.height) {
            const img = imageRef.current;
            const canvas = document.createElement('canvas');

            // Calculate absolute crop size from relative %
            const scaleX = img.naturalWidth / 100;
            const scaleY = img.naturalHeight / 100;

            const cropWidth = crop.width * scaleX;
            const cropHeight = crop.height * scaleY;

            canvas.width = cropWidth;
            canvas.height = cropHeight;

            const ctx = canvas.getContext('2d');
            if (!ctx) return null;

            // Draw the cropped portion of the image directly
            ctx.drawImage(
                img,
                crop.x * scaleX,
                crop.y * scaleY,
                cropWidth,
                cropHeight,
                0,
                0,
                cropWidth,
                cropHeight
            );

            // Return as PNG to preserve transparency
            return canvas.toDataURL('image/png');
        }
    }, []);

    const handleAddCrop = async () => {
        const croppedSrc = await makeClientCrop(crop);
        if (!croppedSrc || !currentImage) return;
        const label = customLabel || selectedLabel;
        const newCropped: CroppedItem = { src: croppedSrc, label, relativeCrop: crop };
        setCroppedImagesMap((prev) => ({
            ...prev,
            [currentImage.id]: prev[currentImage.id] ? [...prev[currentImage.id], newCropped] : [newCropped],
        }));
        setSelectedLabel('');
        setCustomLabel('');
    };

    const handleSave = () => {
        console.log('All cropped images:', croppedImagesMap);
        alert('Cropped images saved! Check console.');
    };

    const handleCropChange = (newCrop: Crop) => {
        if (!imageRef.current) return;

        const img = imageRef.current;

        const cropInPercent: Crop = {
            unit: "%",
            x: (newCrop.x! / img.naturalWidth) * 100,
            y: (newCrop.y! / img.naturalHeight) * 100,
            width: (newCrop.width! / img.naturalWidth) * 100,
            height: (newCrop.height! / img.naturalHeight) * 100,
        };

        setCrop(cropInPercent);
    };

    const handleCropDelete = (cropSrc: string) => {
        setCroppedImagesMap((prev) => ({
            ...prev,
            [currentImage.id]: (prev[currentImage.id] || []).filter(data => data.src !== cropSrc),
        }));
    };

    if (images.length === 0) return <div className="flex flex-col flex-1 justify-center items-center"><Spinner /></div>;

    return (
        <div className="flex flex-col flex-1 gap-4 p-4">
            {/* Image + crop + controls */}
            <div className="flex flex-1 gap-4 flex-wrap md:flex-nowrap">
                {/* Left: main image with crop */}
                <div className="w-full md:w-1/2 flex flex-col gap-2 items-center">
                    <ReactCrop crop={crop} onChange={(c) => handleCropChange(c)} ruleOfThirds>
                        <img ref={imageRef} src={currentImage.url} alt="To crop" className="max-w-full max-h-full object-contain" crossOrigin="anonymous" />
                    </ReactCrop>

                    <div className="flex gap-2 mt-2">
                        <Select onValueChange={(v) => setSelectedLabel(v)} value={selectedLabel} disabled={!!customLabel}>
                            <SelectTrigger className="w-36">
                                <SelectValue placeholder="Select label">{selectedLabel}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {LABEL_OPTIONS.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Input
                            placeholder="Or enter custom label"
                            value={customLabel}
                            onChange={(e) => setCustomLabel(e.target.value)}
                        />

                        <Button onClick={handleAddCrop} disabled={!selectedLabel && !customLabel}>
                            Add Crop
                        </Button>
                    </div>
                </div>

                {/* Right: croppe images for current image */}
                <div className="w-full md:w-1/2 flex flex-col gap-2 overflow-y-auto h-auto md:max-h-[500px]">
                    {(croppedImagesMap[currentImage.id] || []).map((cropItem, idx) => (
                        <div key={idx} className="flex gap-2 border p-2 rounded shadow">
                            <CircleX type='button' className="text-black" onClick={()=>handleCropDelete(cropItem.src)}/>
                                <img src={cropItem.src} alt={`Crop ${idx}`} className="flex-1 w-full h-32 object-contain rounded" />
                            <Input
                                className="flex-2"
                                value={cropItem.label}
                                onChange={(e) => {
                                    const updated = [...(croppedImagesMap[currentImage.id] || [])];
                                    updated[idx].label = e.target.value;
                                    setCroppedImagesMap((prev) => ({
                                        ...prev,
                                        [currentImage.id]: updated,
                                    }));
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom: Next / Previous / Save */}
            <div className="flex gap-2 justify-end">
                <Button onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)} disabled={currentIndex === 0}>
                    Previous
                </Button>
                <Button onClick={handleSave}>Save</Button>
                <Button
                    onClick={() => currentIndex < images.length - 1 && setCurrentIndex(currentIndex + 1)}
                    disabled={currentIndex === images.length - 1}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default ImageCropAnnotator;
