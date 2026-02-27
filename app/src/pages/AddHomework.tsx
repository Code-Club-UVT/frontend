import { useMutation } from "@tanstack/react-query";
import {type SubmitEvent, useRef} from "react";
import { useNavigate } from "react-router-dom";

interface FormData {
	title: string;
	description: string;
	password: string;
}

const AddHomework = () => {
	const titleRef = useRef<HTMLInputElement>(null);
	const descriptionRef = useRef<HTMLTextAreaElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	
	const navigate = useNavigate();

	const { mutate, isPending, error } = useMutation({
		mutationFn: async (formData: FormData) => {
			const data = new FormData();
			data.append("title", formData.title);
			data.append("description", formData.description);
			data.append("password", formData.password);

			const response = await fetch("https://codeclub.info.uvt.ro:8083/TempHomework", {
				method: "POST",
				body: data,
			});

			if (!response.ok) {
				throw new Error("Failed to submit homework");
			}
			
			navigate("/");

			return response.json();
		},
	});

	const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!titleRef.current || !descriptionRef.current || !passwordRef.current) {
			return;
		}

		mutate({
			title: titleRef.current.value,
			description: descriptionRef.current.value,
			password: passwordRef.current.value,
		});
	};

	return (
		<div className="w-full h-full">
			<h1 className="text-2xl font-bold mb-6">Add Homework</h1>

			<form onSubmit={e => handleSubmit(e)} className="space-y-4">
				<div>
					<label htmlFor="title" className="block text-sm font-medium mb-1">
						Title
					</label>
					<input
						ref={titleRef}
						id="title"
						type="text"
						required
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter homework title"
					/>
				</div>

				<div>
					<label htmlFor="description" className="block text-sm font-medium mb-1">
						Description
					</label>
					<textarea
						ref={descriptionRef}
						id="description"
						required
						rows={4}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter homework description"
					/>
				</div>

				<div>
					<label htmlFor="password" className="block text-sm font-medium mb-1">
						Password
					</label>
					<input
						ref={passwordRef}
						id="password"
						type="password"
						required
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter password"
					/>
				</div>

				{error && (
					<div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
						{error instanceof Error ? error.message : "An error occurred"}
					</div>
				)}

				<button
					type="submit"
					disabled={isPending}
					className="w-full px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
				>
					{isPending ? "Submitting..." : "Submit"}
				</button>
			</form>
		</div>
	);
};

export default AddHomework;
