import { useMutation } from "@tanstack/react-query";
import { type SubmitEvent, useRef } from "react";
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

			const response = await fetch(
				`${import.meta.env.VITE_API_BASE_URL}/TempHomework`,
				{
					method: "POST",
					body: data,
				},
			);

			if (!response.ok) {
				throw new Error("Failed to submit homework");
			}

			navigate("/");

			return response.json();
		},
	});

	const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (
			!titleRef.current ||
			!descriptionRef.current ||
			!passwordRef.current
		) {
			return;
		}

		mutate({
			title: titleRef.current.value,
			description: descriptionRef.current.value,
			password: passwordRef.current.value,
		});
	};

	return (
		<div className="h-full w-full">
			<h1 className="mb-6 font-bold text-2xl">Add Homework</h1>

			<form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
				<div>
					<label
						htmlFor="title"
						className="mb-1 block font-medium text-sm"
					>
						Title
					</label>
					<input
						ref={titleRef}
						id="title"
						type="text"
						required
						className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter homework title"
					/>
				</div>

				<div>
					<label
						htmlFor="description"
						className="mb-1 block font-medium text-sm"
					>
						Description
					</label>
					<textarea
						ref={descriptionRef}
						id="description"
						required
						rows={4}
						className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter homework description"
					/>
				</div>

				<div>
					<label
						htmlFor="password"
						className="mb-1 block font-medium text-sm"
					>
						Password
					</label>
					<input
						ref={passwordRef}
						id="password"
						type="password"
						required
						className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter password"
					/>
				</div>

				{error && (
					<div className="rounded border border-red-400 bg-red-100 p-3 text-red-700">
						{error instanceof Error
							? error.message
							: "An error occurred"}
					</div>
				)}

				<button
					type="submit"
					disabled={isPending}
					className="w-full rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
				>
					{isPending ? "Submitting..." : "Submit"}
				</button>
			</form>
		</div>
	);
};

export default AddHomework;
