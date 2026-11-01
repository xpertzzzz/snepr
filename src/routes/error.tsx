import { createFileRoute } from "@tanstack/react-router";
import { ErrorPage } from "@/components/ErrorPage";

export const Route = createFileRoute("/error")({
  head: () => ({
    title: "Error | Snepr",
    meta: [
      { name: "description", content: "Something went wrong. Play our barber memory game while we fix it." },
      { name: "theme-color", content: "#FAF7F2" },
    ],
  }),
  component: ErrorPageRoute,
});

export function ErrorPageRoute() {
  return (
    <ErrorPage
      code="500"
      title="Looks like someone tripped over the clippers cord."
      message="We ran into an unexpected hiccup. Play a round of barber memory while our stylists tidy up."
    />
  );
}

export default ErrorPageRoute;

