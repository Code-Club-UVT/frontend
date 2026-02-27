import { Outlet } from "react-router-dom";

const Layout = () => {
	return (
		<div className={"h-screen w-full bg-[#41b653] p-12"}>
			<div
				className={
					"flex h-full w-full items-center justify-center rounded-4xl bg-white p-8"
				}
			>
				<Outlet />
			</div>
		</div>
	);
};

export default Layout;
