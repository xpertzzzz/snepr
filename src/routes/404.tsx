import { createFileRoute } from "@tanstack/react-router";
import { ErrorPage } from "@/components/ErrorPage";

export const Route = createFileRoute("/404")({
  head: () => ({
    title: "Page unavailable | Snepr",
    meta: [
      { name: "description", content: "Oops! This page isn't working." },
      { name: "theme-color", content: "#FAF7F2" },
    ],
  }),
  component: NotFoundRoute,
});

function NotFoundRoute() {
  return <ErrorPage code="404" message="We couldn't find the page you were looking for." />;
}

export default NotFoundRoute;

