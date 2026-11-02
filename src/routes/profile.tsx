import { createFileRoute } from "@tanstack/react-router";
import { ProfilePageUnified } from "./live/profile";

export const Route = createFileRoute("/profile")({
  component: ProfilePageUnified,
});

export default ProfilePageUnified;

