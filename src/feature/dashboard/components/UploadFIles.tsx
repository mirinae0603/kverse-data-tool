'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dropzone,
    DropzoneContent,
    DropzoneEmptyState,
} from '@/components/ui/shadcn-io/dropzone';
import { toast } from 'sonner';
import { uploadFile } from '@/api/dashboard.api';
import { gradeSubjects } from '@/data/gradeSubjects';

const UploadFiles = () => {
    const [board, setBoard] = useState('');
    const [subject, setSubject] = useState('');
    const [grade, setGrade] = useState('');
    const [chapter, setChapter] = useState('');
    const [book, setBook] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(()=>{
        if(subject){
            setSubject('');
        }
    },[grade]);

    const handleDrop = (acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!board) newErrors.board = 'Please select a board';
        if (!grade) newErrors.grade = 'Please select a grade';
        if (!subject) newErrors.subject = 'Please select a subject';
        // if (!chapter.trim()) newErrors.chapter = 'Please enter a chapter name';
        if (files.length === 0) newErrors.files = 'Please upload at least one file';
        if (!book) newErrors.book = "Please enter the book name"
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error('Please fill all required fields.');
            return;
        }
        console.log({ board, subject, grade, chapter, files });
        const formData = new FormData();
        formData.set("file", files[0]);
        formData.set("board", board);
        formData.set("subject", subject);
        formData.set("chapter", chapter);
        formData.set("grade", grade);
        formData.set("book", book);
        try {
            await uploadFile(formData);
            setBoard("");
            setChapter("");
            setGrade("");
            setSubject("");
            setBook("");
            setFiles([]);
            toast.success('Files uploaded successfully!');
        } catch (error) {
            console.error("Failed to get bot response", error);
        }
        setErrors({});
    };

    const subjects: { subject: string; code: string }[] =
        gradeSubjects.find((g) => g.label === grade)?.values || [];

    return (
        <div className="flex flex-col items-center justify-center flex-1 w-full py-10">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-2xl space-y-6 bg-white rounded-2xl p-6 shadow-sm border"
            >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Board */}
                    <div className="flex flex-col space-y-2">
                        <Label>Board</Label>
                        <Select value={board} onValueChange={setBoard}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select board" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cbse">CBSE</SelectItem>
                                <SelectItem value="icse">ICSE</SelectItem>
                                <SelectItem value="state">State Board</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.board && (
                            <p className="text-sm text-red-500">{errors.board}</p>
                        )}
                    </div>

                    {/* Grade */}
                    <div className="flex flex-col space-y-2">
                        <Label>Grade</Label>
                        <Select value={grade} onValueChange={setGrade}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 7 }, (_, i) => (
                                    <SelectItem key={i + 1} value={`${6 + i}`}>
                                        Grade {6 + i}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.grade && (
                            <p className="text-sm text-red-500">{errors.grade}</p>
                        )}
                    </div>

                    {/* Subject */}
                    <div className="flex flex-col space-y-2">
                        <Label>Subject</Label>
                        <Select value={subject} onValueChange={setSubject} disabled={!grade}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    subjects.map((subject:any)=>(
                                        <SelectItem value={subject.code}>{subject.subject}</SelectItem>
                                    ))
                                }
                                {/* <SelectItem value="maths">Mathematics</SelectItem>
                                <SelectItem value="science">Science</SelectItem>
                                <SelectItem value="english">English</SelectItem>
                                <SelectItem value="social">Social Studies</SelectItem> */}
                            </SelectContent>
                        </Select>
                        {errors.subject && (
                            <p className="text-sm text-red-500">{errors.subject}</p>
                        )}
                    </div>

                    {/* Chapter */}
                    <div className="flex flex-col space-y-2">
                        <Label>Chapter</Label>
                        <Input
                            type="text"
                            placeholder="Enter chapter name"
                            value={chapter}
                            onChange={(e) => setChapter(e.target.value)}
                        />
                        {errors.chapter && (
                            <p className="text-sm text-red-500">{errors.chapter}</p>
                        )}
                    </div>

                    {/* Book Name */}
                    <div className="flex flex-col space-y-2">
                        <Label>Book Name</Label>
                        <Input
                            type="text"
                            placeholder="Enter book name"
                            value={book}
                            onChange={(e) => setBook(e.target.value)}
                        />
                        {errors.book && (
                            <p className="text-sm text-red-500">{errors.book}</p>
                        )}
                    </div>
                </div>

                {/* Dropzone */}
                <div className="mt-4 space-y-4">
                    <Label>Upload File</Label>
                    <Dropzone
                        accept={{
                            'image/*': [],
                            'application/pdf': [],
                            'application/msword': [],
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
                        }}
                        maxFiles={10}
                        minSize={1024}
                        onDrop={handleDrop}
                        onError={(err) => toast.error(err.message || 'Error uploading file')}
                        src={files}
                    >
                        <DropzoneEmptyState />
                        <DropzoneContent />
                    </Dropzone>
                    {errors.files && (
                        <p className="text-sm text-red-500 mt-1">{errors.files}</p>
                    )}
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full mt-5">
                    Upload
                </Button>
            </form>
        </div>
    );
};

export default UploadFiles;
