import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./pages/Layout.tsx";
import Upload from "./pages/Upload.tsx";
import AddHomework from "./pages/AddHomework.tsx";

const AppRoutes = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<Navigate to="/1" replace />} />
					<Route path="/:homeworkNumber" element={<Upload />} />
					<Route path="/homework" element={<AddHomework />} />
					<Route
						path="/not-found"
						element={
							<h1 className={"font-bold text-2xl"}>
								Page not found
							</h1>
						}
					/>
					<Route path="*" element={<Navigate to="/not-found" />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default AppRoutes;
