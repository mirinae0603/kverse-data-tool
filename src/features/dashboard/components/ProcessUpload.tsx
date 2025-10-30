import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import ImageMapping from "./ImageMapping"
import MarkdownViewer from "./MarkdownViewer"
import ImageCropAnnotator from "./ImageAnnotator"

const ProcessUpload = () => {
    const { uploadId } = useParams();

    useEffect(() => {
        console.log("upload Id", uploadId);
    }, [uploadId]);

    if (!uploadId) {
        return <div className="flex flex-col flex-1 items-center justify-center">
            No upload id found.
        </div>;
    }

    return (
        <div className="flex flex-col flex-1 p-4">
            <Tabs defaultValue="unlabelled" className="flex flex-col flex-1 w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-3 w-full">
                    <TabsTrigger value="unlabelled">Unlabelled</TabsTrigger>
                    <TabsTrigger value="markdownViewer">Markdown Viewer</TabsTrigger>
                    <TabsTrigger value="imageAnnotations">Image Annotations</TabsTrigger>
                </TabsList>

                {/* 👇 This wrapper ensures "fill remaining space" but allows growth */}
                <div className="flex-1 min-h-0">
                    <TabsContent value="unlabelled" className="h-full min-h-full w-full flex">
                        <ImageMapping mode="unlabelled" uploadId={uploadId} />
                    </TabsContent>

                    <TabsContent value="markdownViewer" className="h-full min-h-full w-full flex">
                        <MarkdownViewer uploadId={uploadId} />
                    </TabsContent>

                    <TabsContent value="imageAnnotations" className="h-full min-h-full w-full flex">
                        <ImageCropAnnotator uploadId={uploadId} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}

export default ProcessUpload;
