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

	if (!homeworkNumber || Number.isNaN(parseInt(homeworkNumber, 10))) {
		return <Navigate to="/not-found" replace />;
	}

	const {
		data: homework,
		isLoading,
		error,
	} = useQuery<Homework>({
		queryKey: ["homework", homeworkNumber],
		queryFn: async () => {
			const response = await fetch(
				`${import.meta.env.VITE_API_BASE_URL}/TempHomework/${homeworkNumber}`,
			);
			if (!response.ok) {
				throw new Error("Failed to fetch homework");
			}
			return response.json();
		},
		enabled: !!homeworkNumber && !Number.isNaN(parseInt(homeworkNumber, 10)),
	});

	const { mutate: uploadFile, isPending: isUploading } = useMutation({
		mutationFn: async (file: File) => {
			const formData = new FormData();
			formData.append("file", file);

			const response = await fetch(
				`${import.meta.env.VITE_API_BASE_URL}/TempFiles/${homework?.id}`,
				{
					method: "POST",
					body: formData,
				},
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
					"Invalid file type. Please upload a .py, .cpp, or .sb3 file.",
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
			<div className="flex h-full w-full items-center justify-center">
				Loading homework...
			</div>
		);
	}

	if (error || !homework) {
		return (
			<div className="flex h-full w-full flex-col items-center justify-center">
				<p className="mb-4 text-red-500">Failed to load homework</p>
				<Navigate to="/1" replace />
			</div>
		);
	}

	return (
		<div className={"h-full w-full"}>
			<div className={"flex h-full w-full flex-col items-center"}>
				<h1 className="mb-8 w-full text-center font-bold text-2xl">
					{homework.title}
				</h1>
				<p className="mb-4 w-full">{homework.description}</p>

				<div className="mt-8 flex w-1/2 flex-col items-center rounded-lg border-2 border-gray-300 border-dashed p-4">
					<label
						htmlFor="file-input"
						className="mb-2 block font-medium text-sm"
					>
						Upload File
					</label>
					<input
						ref={fileInputRef}
						id="file-input"
						type="file"
						accept=".py,.cpp,.sb3"
						onChange={handleFileChange}
						className="block w-full text-gray-500 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-blue-700 file:text-sm hover:file:bg-blue-100"
					/>
					{selectedFile && (
						<p className="mt-2 text-green-600 text-sm">
							Selected: {selectedFile.name}
						</p>
					)}
					<button
						onClick={handleUpload}
						disabled={!selectedFile || isUploading}
						className="mt-4 rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
					>
						{isUploading ? "Uploading..." : "Upload"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Upload;
