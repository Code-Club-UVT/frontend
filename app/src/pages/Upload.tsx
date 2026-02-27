import { Navigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

interface Homework {
	id: string;
	number: number;
	title: string;
	description: string;
}

const Upload = () => {
	const { homeworkNumber } = useParams();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	// Validate and redirect early if invalid
	if (!homeworkNumber || isNaN(parseInt(homeworkNumber))) {
		return <Navigate to="/not-found" replace />;
	}

	const { data: homework, isLoading, error } = useQuery<Homework>({
		queryKey: ["homework", homeworkNumber],
		queryFn: async () => {
			const response = await fetch(
				`https://codeclub.info.uvt.ro:8083/TempHomework/${homeworkNumber}`
			);
			if (!response.ok) {
				throw new Error("Failed to fetch homework");
			}
			return response.json();
		},
		enabled: !!homeworkNumber && !isNaN(parseInt(homeworkNumber)),
	});

	const { mutate: uploadFile, isPending: isUploading } = useMutation({
		mutationFn: async (file: File) => {
			const formData = new FormData();
			formData.append("file", file);

			const response = await fetch(
				`https://codeclub.info.uvt.ro:8083/TempFiles/${homework!.id}`,
				{
					method: "POST",
					body: formData,
				}
			);

			if (!response.ok) {
				throw new Error("Failed to upload file");
			}

			return response.json();
		},
		onSuccess: () => {
			toast.success("File uploaded successfully!");
			setSelectedFile(null);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		},
		onError: () => {
			toast.error("Failed to upload file");
		},
	});

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const validExtensions = ["py", "cpp", "sb3"];
			const fileExtension = file.name.split(".").pop()?.toLowerCase();

			if (!fileExtension || !validExtensions.includes(fileExtension)) {
				alert(
					"Invalid file type. Please upload a .py, .cpp, or .sb3 file."
				);
				if (fileInputRef.current) {
					fileInputRef.current.value = "";
				}
				return;
			}

			setSelectedFile(file);
		}
	};

	const handleUpload = () => {
		if (selectedFile) {
			uploadFile(selectedFile);
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-full w-full">
				Loading homework...
			</div>
		);
	}

	if (error || !homework) {
		return (
			<div className="flex items-center justify-center h-full w-full flex-col">
				<p className="text-red-500 mb-4">Failed to load homework</p>
				<Navigate to="/1" replace />
			</div>
		);
	}

	return (
		<div className={"h-full w-full"}>
			<div className={"flex flex-col items-center h-full w-full"}>
				<h1 className="w-full text-2xl text-center font-bold mb-8">
					{homework.title}
				</h1>
				<p className="w-full mb-4">{homework.description}</p>

				<div className="flex flex-col items-center w-1/2 mt-8 p-4 border-2 border-dashed border-gray-300 rounded-lg">
					<label
						htmlFor="file-input"
						className="block text-sm font-medium mb-2"
					>
						Upload File
					</label>
					<input
						ref={fileInputRef}
						id="file-input"
						type="file"
						accept=".py,.cpp,.sb3"
						onChange={handleFileChange}
						className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
					/>
					{selectedFile && (
						<p className="mt-2 text-sm text-green-600">
							Selected: {selectedFile.name}
						</p>
					)}
					<button
						onClick={handleUpload}
						disabled={!selectedFile || isUploading}
						className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
					>
						{isUploading ? "Uploading..." : "Upload"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Upload;
