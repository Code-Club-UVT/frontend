import { Outlet } from "react-router-dom";

const Layout = () => {
	return (
		<div className={"h-screen w-full p-12 bg-[#41b653]"}>
			<div className={"h-full w-full bg-white rounded-4xl p-8 flex items-center justify-center"}>
				<Outlet />
			</div>
		</div>
	);
};

export default Layout;
