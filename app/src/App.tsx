import AppProviders from "./AppProviders.tsx";
import AppRoutes from "./AppRoutes.tsx";

const App = () => {
	return (
		<AppProviders>
			<AppRoutes />
		</AppProviders>
	);
};

export default App;
