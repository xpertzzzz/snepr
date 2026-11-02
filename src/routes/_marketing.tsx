import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

export const Route = createFileRoute("/_marketing")({
  component: MarketingLayout,
});

function MarketingLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "";

  if (isHome) {
    return <Outlet />;
  }

  return (
    <>
      <Navbar />
      <div className="pt-20 sm:pt-24 min-h-screen bg-[#f7f3ed] text-[#211914] flex flex-col">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
