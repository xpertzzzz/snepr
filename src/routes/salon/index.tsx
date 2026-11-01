import { createFileRoute } from "@tanstack/react-router";
import { SalonOSPage } from "../salon-os/index";

export const Route = createFileRoute("/salon/")({
  component: SalonOSPage,
});

export default SalonOSPage;
