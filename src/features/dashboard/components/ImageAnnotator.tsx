import React, { useState, useRef, useEffect, useCallback, type FormEvent } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { CircleX } from 'lucide-react';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { Skeleton } from '@/components/ui/skeleton';
import { generateImageDescriptions, getImageDescriptions, getImageDescriptionStatus, onCompleteProcess, saveCroppedImagesWithDescriptions } from '@/api/dashboard.api';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

type CroppedItem = {
    src: string;
    description: string;
    name: string
    relativeCrop: Crop;
};

type ImageItem = {
    id: string;
    url: string;
    descriptions: Array<string>;
    names: Array<string>;
};

// const LABEL_OPTIONS = ['Person', 'Car', 'Animal', 'Other'];

// function centerAspectCrop(
//     mediaWidth: number,
//     mediaHeight: number,
//     aspect: number,
// ) {
//     return centerCrop(
//         makeAspectCrop(
//             {
//                 unit: '%',
//                 width: 90,
//             },
//             aspect,
//             mediaWidth,
//             mediaHeight,
//         ),
//         mediaWidth,
//         mediaHeight,
//     )
// }

interface ImageCropAnnotatorProps {
    uploadId:string
}

const ImageCropAnnotator: React.FC<ImageCropAnnotatorProps> = ({uploadId}) => {
    const [images, setImages] = useState<ImageItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [crop, setCrop] = useState<Crop>();
    const [croppedImagesMap, setCroppedImagesMap] = useState<Record<string, CroppedItem[]>>({});
    const [selectedDescription, setSelectedDescription] = useState('');
    const [selectedName, setSelectedName] = useState('');
    const [isLoadedImage, setIsLoadedImage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [input, setInput] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [generating, setGenerating] = useState(false);
    const imageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        let isMounted = true;

        const getImages = async () => {
            setLoading(true);
            try {
                const data = await getImageDescriptionStatus(uploadId);
                if (!isMounted) return;

                if (data.status === "missing") {
                    setShowInput(true);
                } else {
                    await fetchImages();
                }
            } catch (error) {
                if (isMounted) console.error("Error fetching images:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        getImages();

        return () => {
            isMounted = false;
        };
    }, []);

    const fetchImages = async () => {
        try {
            const data = await getImageDescriptions(uploadId);
            if (Array.isArray(data.message) && data.message.length > 0) {
                let formatted_data: ImageItem[] = data.message.map((msg: any, ind: number) => ({ id: ind.toString(), url: msg.image_url, descriptions: msg.descriptions, names: msg.names }));
                setImages(formatted_data);
            }
        } catch (error) {
            console.error("Error fetching image descriptions:", error);
        }
    };

    const currentImage = images[currentIndex];

    // Generate cropped image using relative coordinates
    const makeClientCrop = useCallback(
        async (crop: Crop) => {
            if (!imageRef.current || !crop.width || !crop.height) return null;

            const img = imageRef.current;
            const canvas = document.createElement('canvas');

            // Convert percentage to absolute pixels
            const cropX = (crop.x / 100) * img.naturalWidth;
            const cropY = (crop.y / 100) * img.naturalHeight;
            const cropWidth = (crop.width / 100) * img.naturalWidth;
            const cropHeight = (crop.height / 100) * img.naturalHeight;

            console.log({ cropX, cropY, cropWidth, cropHeight });

            // Set canvas to crop size
            canvas.width = Math.round(cropWidth);
            canvas.height = Math.round(cropHeight);

            const ctx = canvas.getContext('2d');
            if (!ctx) return null;

            // Draw the cropped image
            ctx.drawImage(
                img,
                Math.round(cropX),
                Math.round(cropY),
                Math.round(cropWidth),
                Math.round(cropHeight),
                0,
                0,
                Math.round(cropWidth),
                Math.round(cropHeight)
            );

            // Return base64 image (PNG)
            return canvas.toDataURL('image/png');
        },
        []
    );

    const handleAddCrop = async () => {
        if (!crop) {
            return;
        }
        if (!imageRef.current) return;

        const img = imageRef.current;

        console.log("base crop", crop);

        const cropValue: Crop =
            crop.unit === '%'
                ? crop
                : {
                    unit: '%',
                    x: (crop.x! / img.width) * 100,
                    y: (crop.y! / img.height) * 100,
                    width: (crop.width! / img.width) * 100,
                    height: (crop.height! / img.height) * 100,
                };

        const croppedSrc = await makeClientCrop(cropValue);
        if (!croppedSrc || !currentImage) return;
        const newCropped: CroppedItem = { src: croppedSrc, description: selectedDescription, relativeCrop: cropValue, name: selectedName };
        setCroppedImagesMap((prev) => ({
            ...prev,
            [currentImage.id]: prev[currentImage.id] ? [...prev[currentImage.id], newCropped] : [newCropped],
        }));
        setSelectedDescription('');
        setSelectedName('');
    };

    const handleSave = async () => {
        try {
            const currentCrops = croppedImagesMap[currentImage.id];
            const payload = {
                image_url: currentImage.url, 
                coords: currentCrops.map((crop: CroppedItem) => ({
                    name: crop.name,
                    description: crop.description,
                    relativeCoordinates: crop.relativeCrop, 
                })),
            };
            await saveCroppedImagesWithDescriptions(uploadId,payload);
        } catch (error) {
            console.error("Error saving cropped images:", error);
        }
    };

    const handleCropChange = (newCrop: Crop) => {
        setCrop(newCrop);
    };

    const handleCropDelete = (cropSrc: string) => {
        setCroppedImagesMap((prev) => ({
            ...prev,
            [currentImage.id]: (prev[currentImage.id] || []).filter(data => data.src !== cropSrc),
        }));
    };

    const onImageLoad = () => {
        setCrop({
            unit: '%',
            width: 50, // initial width 50%
            height: 50, // initial height 50%
            x: 25, // center crop
            y: 25,
        });

        setIsLoadedImage(true);
    };

    const handleSubmit = async (e: FormEvent) => {
        setShowInput(false);
        setGenerating(true);
        try {
            e.preventDefault();
            await generateImageDescriptions(uploadId,input);
            await new Promise(resolve => setTimeout(resolve, 5000));
            await fetchImages();
        } catch (error) {
            console.log(error);
        } finally {
            setGenerating(false);
        }
    }

    const handleComplete = async () => {
        try {
            await onCompleteProcess(uploadId);
            toast.success("Process completed succesfully!");
        } catch (error){
            console.error(error);
            toast.error("Failed to complete the process");
        }
    }

    if (loading && !generating && !showInput) {
        return <div className="flex flex-col flex-1 justify-center items-center"><Spinner /></div>
    }

    if (showInput) {
        return <>
            <div className="flex flex-col flex-1 justify-center items-center p-4">
                <form className="flex flex-col gap-3 w-full max-w-xl" onSubmit={handleSubmit}>
                    <Textarea
                        placeholder="Enter topic"
                        className="flex-1"
                        onChange={e => setInput(e.target.value)}
                    />
                    <Button
                        className="w-full sm:w-auto"
                        type="submit"
                        disabled={!input}
                    >
                        Submit
                    </Button>
                </form>
            </div>
        </>
    }

    if (generating) {
        return <>
            <div className="flex flex-col flex-1 justify-center items-center">
                <Spinner />
                <p className="text-gray-600 mt-2 text-lg">Image descriptions are getting generated. Please wait...</p>
            </div>
        </>
    }

    if (images.length === 0) {
        return <div className="flex flex-col flex-1 justify-center items-center">
            <p className="text-gray-600 text-lg">No images available for annotation.</p>
        </div>
    }

    return (
        <div className="flex flex-col flex-1 gap-4 p-4">
            {/* Image + crop + controls */}
            <div className="flex flex-1 gap-4 flex-wrap md:flex-nowrap">
                {/* Left: main image with crop */}
                <div className="w-full md:w-1/2 flex flex-col gap-2 items-center">
                    <ReactCrop crop={crop} onChange={(c) => handleCropChange(c)} ruleOfThirds>
                        <img key={currentImage.url} ref={imageRef} src={currentImage.url} alt="To crop" className="max-w-full max-h-full object-contain" crossOrigin='anonymous' onLoad={onImageLoad} />
                    </ReactCrop>
                    {!isLoadedImage && <Skeleton className="w-full h-full" />}

                    <div className="flex gap-2 mt-2">
                        <Select onValueChange={(v) => setSelectedDescription(v)} value={selectedDescription}>
                            <SelectTrigger className="max-w-xs">
                                <SelectValue placeholder="Select Description">{selectedDescription}</SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-w-xs">
                                {currentImage.descriptions.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select onValueChange={(v) => setSelectedName(v)} value={selectedName}>
                            <SelectTrigger className="max-w-sm">
                                <SelectValue placeholder="Select Name">{selectedName}</SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-w-sm">
                                {currentImage.names.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button onClick={handleAddCrop} disabled={!selectedDescription && !selectedName}>
                            Add Crop
                        </Button>
                    </div>
                </div>

                {/* Right: croppe images for current image */}
                <div className="w-full md:w-1/2 flex flex-col gap-2 overflow-y-auto h-auto md:max-h-[500px]">
                    {(croppedImagesMap[currentImage.id] || []).map((cropItem, idx) => (
                        <div key={idx} className="flex gap-2 border p-2 rounded shadow">
                            <CircleX type='button' className="text-black" onClick={() => handleCropDelete(cropItem.src)} />
                            <img src={cropItem.src} alt={`Crop ${idx}`} className="flex-1 w-full h-32 object-contain rounded" />
                            <div className="flex-2 flex flex-col gap-3">
                                <div className="grid gap-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={cropItem.description}
                                        onChange={(e) => {
                                            const updated = [...(croppedImagesMap[currentImage.id] || [])];
                                            updated[idx].description = e.target.value;
                                            setCroppedImagesMap((prev) => ({
                                                ...prev,
                                                [currentImage.id]: updated,
                                            }));
                                        }}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Name</Label>
                                    <Input
                                        value={cropItem.name}
                                        onChange={(e) => {
                                            const updated = [...(croppedImagesMap[currentImage.id] || [])];
                                            updated[idx].name = e.target.value;
                                            setCroppedImagesMap((prev) => ({
                                                ...prev,
                                                [currentImage.id]: updated,
                                            }));
                                        }}
                                    >
                                    </Input>
                                </div>
                            </div>

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
                {currentIndex === images.length - 1 && 
                <Button
                onClick={()=>handleComplete()}
                >
                    Complete
                </Button>
                }
            </div>
        </div>
    );
};

export default ImageCropAnnotator;
