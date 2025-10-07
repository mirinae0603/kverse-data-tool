import { Button } from '@/components/ui/button';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/shadcn-io/dropzone';
import { useState } from 'react';
import { toast } from 'sonner';
const UploadFiles = () => {
    const [files, setFiles] = useState<File[] | undefined>();
    const handleDrop = (files: File[]) => {
        console.log(files);
        console.log(files);
        setFiles(files);
    };

    const handleUpload = () => {
        toast.success("File is uploaded");
    }


    return (
        <div className="flex flex-col flex-1 justify-center item-center">
            <div className="w-full max-w-2xl mx-auto">
                <Dropzone
                    accept={{ 'image/*': [] }}
                    maxFiles={10}
                    maxSize={1024 * 1024 * 10}
                    minSize={1024}
                    onDrop={handleDrop}
                    onError={console.error}
                    src={files}
                >
                    <DropzoneEmptyState />
                    <DropzoneContent />
                </Dropzone>
                <Button className="w-full mt-5 cursor-pointer" onClick={handleUpload}>
                    Upload
                </Button>
            </div>

        </div>

    );
};
export default UploadFiles;