import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Response } from '@/components/ui/shadcn-io/ai/response';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { SafeImage } from '@/components/ui/safe-image';

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
    const [isEditMode, setIsEditMode] = useState(true);

    // Simulate fetching data
    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            await new Promise((res) => setTimeout(res, 500));

            const data: MarkdownItem[] = [
                { id: '1', imageUrl: 'https://picsum.photos/400?random=1', markdown: '# Markdown 1\nSome text here.',isSaved:false },
                { id: '2', imageUrl: 'https://picsum.photos/400?random=2', markdown: '## Markdown 2\nAnother text here.',isSaved:false },
                { id: '3', imageUrl: 'https://picsum.photos/400?random=3', markdown: '### Markdown 3\nMore text.',isSaved:false },
            ];

            setItems(data);
            setCurrentMarkdown(data[0].markdown);
            setLoading(false);
        };

        fetchItems();
    }, []);



    const currentItem = items[currentIndex];

    const handleSave = () => {
        console.log(`Saved markdown for item ${currentItem.id}:`, currentMarkdown);
    };

    const handleNext = () => {
        handleSave();
        if (currentIndex < items.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setCurrentMarkdown(items[currentIndex + 1].markdown);
            setIsEditMode(true);
        } else {
            alert('Reached last item');
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setCurrentMarkdown(items[currentIndex - 1].markdown);
            setIsEditMode(true);
        }
    };

    if(loading) {
        return <div className="flex flex-col flex-1 justify-center items-center"><Spinner /></div>;
    }

    if (!items.length) return <p>No items found.</p>;

    return (
        <div className="flex flex-col flex-1 gap-4 p-4">
            {/* The flex container for image + markdown */}
            <div className="flex flex-1 gap-4">
                {/* Left: Image */}
                <div className="w-1/2 flex flex-col justify-center items-center">
                    <img
                        src={currentItem.imageUrl}
                        alt={`Image ${currentItem.id}`}
                        className="max-w-full max-h-full object-contain rounded shadow flex-1"
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
                                className="flex-1 w-full p-2 border rounded resize-none"
                                value={currentMarkdown}
                                onChange={(e) => setCurrentMarkdown(e.target.value)}
                            />
                        ) : (
                            <div className="flex-1 border p-2 rounded overflow-auto">
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
                <Button onClick={handleNext} disabled={currentIndex === items.length - 1}>
                    Next
                </Button>
            </div>
        </div>

    );
};

export default MarkdownViewer;
