// components/ImageDropdowns.tsx
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SafeImage } from '@/components/ui/safe-image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageZoom } from '@/components/ui/shadcn-io/image-zoom';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import React, { useEffect, useState } from 'react';


// Types
type Image = {
    id: string;
    url: string;
    alt: string;
    isLabelled: boolean;
};

type ImageMappingProps = {
    mode: "unlabelled" | "labelled"
}

const ImageMapping: React.FC<ImageMappingProps> = ({ mode }) => {
    const [images, setImages] = useState<Image[]>([]);
    const [options, setOptions] = useState<string[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<{ [imageId: string]: string }>({});
    const [loading, setLoading] = useState(true);

    // Simulate fetching from API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            // Simulated API call (replace with real API calls)
            let fetchedImages = [
                { id: '1', url: 'https://picsum.photos/500?random=1', alt: 'Image 1' },
                { id: '2', url: 'https://picsum.photos/500?random=1', alt: 'Image 2' },
                { id: '3', url: 'https://picsum.photos/500?random=1', alt: 'Image 3' },
                { id: '4', url: 'https://picsum.photos/500?random=1', alt: 'Image 1' },
                { id: '5', url: 'https://picsum.photos/500?random=1', alt: 'Image 2' },
                { id: '6', url: 'https://picsum.photos/500?random=1', alt: 'Image 3' },
                { id: '7', url: 'https://picsum.photos/500?random=1', alt: 'Image 1' },
                { id: '8', url: 'https://picsum.photos/500?random=1', alt: 'Image 2' },
                { id: '9', url: 'https://picsum.photos/500?random=1', alt: 'Image 3' },
            ];

            let fI: Image[] = fetchedImages.map(img => ({ ...img, isLabelled: false }))

            const fetchedOptions: string[] = ['Option 1', 'Option 2', 'Option 3'];

            // Set state
            setImages(fI);
            setOptions(fetchedOptions);

            // Initialize selected options with first value
            const initialSelections = fetchedImages.reduce((acc, img) => {
                acc[img.id] = "";
                return acc;
            }, {} as { [key: string]: string });

            setSelectedOptions(initialSelections);
            setLoading(false);
        };

        fetchData();
    }, []);

    const handleChange = (imageId: string, value: string) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [imageId]: value,
        }));
    };

    const handleSubmit = () => {
        console.log('Submitted:', selectedOptions);
        // Submit selectedOptions to API here
    };

    const handleSave = (imageId: string) => {
        console.log("imageId", imageId);
        console.log("selected value", selectedOptions[imageId]);
        if (!selectedOptions[imageId]) {
            return;
        }
        setImages((images) =>
            images.map((img) =>
                img.id === imageId ? { ...img, isLabelled: true } : img
            )
        );

    }

    if (loading) {
       return <div className="flex flex-col flex-1 justify-center items-center"><Spinner /></div>
    }

    return (
        <div className="p-4">
            <div className="grid grid-cols-4 gap-4">
                {images.map((image) => (
                    <div key={image.id} className="space-y-4 ">
                        {/* <img src={image.url} alt={image.alt} style={{ width: '150px', height: 'auto' }} /> */}
                        <ImageZoom>
                            <div className="relative">
                                {/* <img
                                    src={image.url}
                                    alt={image.alt}
                                    className="h-auto w-full cursor-pointer"
                                    style={{
                                        maxWidth: '100%', // Ensure it’s responsive
                                        height: 'auto',
                                    }}
                                /> */}
                                <SafeImage src={image.url} alt={image.alt}/>
                                {/* Conditionally render diagonal text */}
                                {image.isLabelled && mode === 'unlabelled' && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <span
                                            className="text-white text-2xl font-bold opacity-70 select-none"
                                            style={{
                                                transform: "rotate(-30deg)",
                                                background: "rgba(0, 0, 0, 0.4)",
                                                padding: "4px 16px",
                                                borderRadius: "8px",
                                            }}
                                        >
                                            Labelled
                                        </span>
                                    </div>
                                )}
                            </div>

                        </ImageZoom>

                        {/* <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline">
                                    {selectedOptions[image.id] ?? 'Select option'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent side="bottom" align="start">
                                {options.map((option) => (
                                    <Button
                                        key={option}
                                        variant="ghost"
                                        onClick={() => handleChange(image.id, option)}
                                    >
                                        {option}
                                    </Button>
                                ))}
                            </PopoverContent>
                        </Popover> */}
                        <div className="flex gap-2">
                            <Select onValueChange={(value) => handleChange(image.id, value)} disabled={image.isLabelled || mode === 'labelled'}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Theme">{selectedOptions[image.id]}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {options.map(option => (
                                        <SelectItem value={option}>{option}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {mode === "unlabelled" && <Button onClick={() => handleSave(image.id)} disabled={!selectedOptions[image.id] || image.isLabelled}>Save</Button>}
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageMapping;
