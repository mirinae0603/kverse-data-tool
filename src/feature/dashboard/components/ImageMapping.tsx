// components/ImageDropdowns.tsx
import { getImagesForLabelling, postLabelForImage } from '@/api/dashboard.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SafeImage } from '@/components/ui/safe-image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageZoom } from '@/components/ui/shadcn-io/image-zoom';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { useLabelled } from '@/context/LabelledNavContext';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

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
    const [searchParams] = useSearchParams();
    const labelClass = searchParams.get('class') ?? '';
    const [images, setImages] = useState<Image[]>([]);
    const [options, setOptions] = useState<string[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<{ [imageId: string]: string }>({});
    const [customClasses, setCustomClasses] = useState<{ [imageId: string]: string }>({});
    const [loading, setLoading] = useState(true);
    const { fetchLabels } = useLabelled();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            let fetchedImages: Image[] = [];
            try {
                const className = mode === 'unlabelled' ? "unclassified" : labelClass;
                const data = await getImagesForLabelling(className);
                data.map((img: string, ind: number) => fetchedImages.push({ id: `${ind}`, url: img, alt: `Image ${ind + 1}`, isLabelled: false }))

                const fetchedOptions: string[] = ['Chapter', 'Index'];

                // Set state
                setImages(fetchedImages);
                setOptions(fetchedOptions);

                // Initialize selected options with first value
                const initialSelections = fetchedImages.reduce((acc, img) => {
                    acc[img.id] = "";
                    return acc;
                }, {} as { [key: string]: string });

                setSelectedOptions(initialSelections);
            } catch (error) {
                console.error(error);

            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [labelClass]);

    const handleChange = (imageId: string, value: string) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [imageId]: value,
        }));
    };

    // const handleSubmit = () => {
    //     console.log('Submitted:', selectedOptions);
    //     // Submit selectedOptions to API here
    // };

    const handleSave = async (imageId: string,imageUrl:string) => {
        console.log("imageId", imageId);
        console.log("selected value", selectedOptions[imageId]);
        if ((!selectedOptions[imageId] && !customClasses[imageId])) {
            return;
        }
        const value = selectedOptions[imageId] || customClasses[imageId];
        try {
            await postLabelForImage({ label: value, image_url: imageUrl });
            if (customClasses[imageId]) {
                fetchLabels();
                toast.success(`Custom label "${value}" added and available in sidebar!`);
            }
            setImages((images) =>
                images.map((img) =>
                    img.id === imageId ? { ...img, isLabelled: true } : img
                )
            );
            toast.success('Image labeled successfully!');
        }
        catch (error) {
            console.error(error);
            toast.error('Something went wrong while labeling the image.');
        }
    }

    if (loading) {
        return <div className="flex flex-col flex-1 justify-center items-center"><Spinner /></div>
    }

    if(images.length === 0){
        return <div className="flex flex-col flex-1 justify-center items-center">
            <p className="text-gray-600 text-lg">No images available for labelling.</p>
        </div>
    }

    return (
        <div className="p-4">
            <div className="grid grid-cols-4 gap-4">
                {images.map((image) => (
                    <div key={image.id} className="space-y-4 ">
                        {/* <img src={image.url} alt={image.alt} style={{ width: '150px', height: 'auto' }} /> */}
                        <ImageZoom>
                            <div className="relative">
                                <SafeImage src={image.url} alt={image.alt} height="h-80" />
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
                        {mode === 'unlabelled' && <div className="flex gap-2">
                            <Select onValueChange={(value) => handleChange(image.id, value)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Class">{selectedOptions[image.id]}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {options.map(option => (
                                        <SelectItem value={option}>{option}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input
                                type="text"
                                placeholder="Enter a custom class"
                                value={customClasses[image.id] || ''}
                                onChange={(e) => setCustomClasses(prev => ({ ...prev, [image.id]: e.target.value }))}
                            />
                            <Button onClick={() => handleSave(image.id,image.url)} disabled={(!selectedOptions[image.id] && !customClasses[image.id]) || image.isLabelled}>Save</Button>
                        </div>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageMapping;
