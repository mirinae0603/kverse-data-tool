import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Response } from '@/components/ui/shadcn-io/ai/response';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { getMarkdown, saveMarkdown } from '@/api/dashboard.api';

type MarkdownItem = {
    id: string;
    imageUrl: string;
    markdown: string;
    isSaved: boolean;
};

const MarkdownViewer: React.FC = () => {
    const [items, setItems] = useState<MarkdownItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentMarkdown, setCurrentMarkdown] = useState('');
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        const isPollingRef = { current: true }; // simple ref-like object
        let hasFetchedOnce = false;

        const fetchItems = async () => {
            setLoading(true);
            try {
                const poll = async () => {
                    if (!isPollingRef.current) return;

                    try {
                        const data = await getMarkdown();

                        if (!data || data.status === "error" || data.status === "warning") {
                            throw new Error(data.messsage);
                        }

                        if (data.status === "processing" && data.markdown.payload.length === 0) {
                            timeoutId = setTimeout(poll, 15000);
                            return;
                        }

                        if (Array.isArray(data.markdown.payload) && data.markdown.payload.length > 0) {
                            const mapped = data.markdown.payload.map((item: any) => ({
                                id: item.image_url,
                                imageUrl: item.image_url,
                                markdown: item.generated_MD,
                                isSaved: false,
                            }));

                            if (!hasFetchedOnce) {
                                setItems(mapped);
                                setCurrentMarkdown(mapped[0].markdown);
                                setLoading(false);
                                setProcessing(false);
                                hasFetchedOnce = true;
                            } else {
                                setItems((prevItems) => {
                                    const existingIds = new Set(prevItems.map((i) => i.id));
                                    const newItems = mapped.filter(
                                        (i: MarkdownItem) => !existingIds.has(i.id)
                                    );
                                    if (newItems.length === 0) return prevItems;
                                    return [...prevItems, ...newItems];
                                });
                            }

                            const done = data.status === "success";
                            if (!done && isPollingRef.current) {
                                timeoutId = setTimeout(poll, 15000);
                            }
                        }
                    } catch (err) {
                        console.error(err);
                        setLoading(false);
                    }
                };

                poll();
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    console.error(error);
                    toast.error("Something went wrong! Please try again later.");
                }
            }
        };

        fetchItems();

        return () => {
            isPollingRef.current = false; // ✅ safely stop further polls
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);
    const currentItem = items[currentIndex];

    const handleSave = async () => {
        console.log(`Saved markdown for item ${currentItem.id}:`, currentMarkdown);
        if (currentItem.isSaved) {
            return;
        }
        try {
            await saveMarkdown({ image_url: currentItem.imageUrl, markdown: currentMarkdown });
            setItems((items: MarkdownItem[]) =>
                items.map(item =>
                    item.id === currentItem.imageUrl ? { ...item, markdown: currentMarkdown, isSaved: true } : item
                )
            );
            toast.success("Markdown saved!");
        } catch (error) {
            console.log(error);
        }
    };

    const handleNext = () => {
        if (!currentItem.isSaved) {
            toast.error("Need to save the current item to continue!");
        }
        if (currentIndex < items.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsImageLoaded(false);
            setCurrentMarkdown(items[currentIndex + 1].markdown);
            setIsEditMode(true);
        } else {
            alert('Reached last item');
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsImageLoaded(false);
            setCurrentMarkdown(items[currentIndex - 1].markdown);
            setIsEditMode(true);
        }
    };

    if (loading && !processing) {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Spinner />
            </div>
        );
    }

    if (processing) {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Spinner />
                <p className="text-gray-600 mt-2 text-lg">Markdown's are being fetched. Please wait...</p>
            </div>
        );
    }

    if(!currentItem){
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <p className="text-graty-600 mt-2 text-lg">No data to extract markdown from.</p>
            </div>
        )
    }

    if (error) return (
        <div className="flex flex-col flex-1 justify-center items-center">
            <p className="text-gray-600 text-lg">{error}</p>
        </div>
    );

    return (
        <div className="flex flex-col flex-1 gap-4 p-4">
            {/* The flex container for image + markdown */}
            <div className="flex flex-1 gap-4">
                {/* Left: Image */}
                <div className="w-1/2 relative flex flex-col justify-center items-center bg-gray-100 p-4 rounded-lg">
                    {/* Skeleton placeholder */}
                    {!isImageLoaded && (
                        <Skeleton className="absolute inset-0 h-full w-full rounded shadow animate-pulse" />
                    )}

                    {/* Actual image */}
                    <img
                        src={currentItem.imageUrl}
                        alt={`Image ${currentItem.id}`}
                        onLoad={() => setIsImageLoaded(true)}
                        className={`max-w-full max-h-full object-contain rounded shadow flex-1 transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                    />
                </div>

                {/* Right: Markdown editor / preview */}
                <div className="w-1/2 flex flex-col gap-2">
                    {/* Toggle button */}
                    <div className="flex justify-end mb-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsEditMode(!isEditMode)}
                        >
                            {isEditMode ? 'Preview' : 'Edit'}
                        </Button>
                    </div>

                    {/* Editor / Preview takes remaining space */}
                    <div className="flex flex-1 flex-col gap-2">
                        {isEditMode ? (
                            <textarea
                                className="flex-1 w-full p-2 border rounded-lg resize-none"
                                value={currentMarkdown}
                                onChange={(e) => setCurrentMarkdown(e.target.value)}
                            />
                        ) : (
                            <div className="flex-1 border p-2 rounded-lg overflow-auto">
                                <Response>{currentMarkdown}</Response>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-2 justify-end">
                <Button onClick={handlePrev} disabled={currentIndex === 0}>
                    Previous
                </Button>
                <Button onClick={handleSave} disabled={currentItem.isSaved}>Save</Button>
                <Button onClick={handleNext} disabled={currentIndex === items.length - 1 || !currentItem.isSaved}>
                    Next
                </Button>
            </div>
        </div>
    );
};

export default MarkdownViewer;
