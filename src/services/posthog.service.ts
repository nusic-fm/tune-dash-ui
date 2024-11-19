import { posthog } from "posthog-js";

posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
  api_host: "https://us.i.posthog.com",
  person_profiles: "identified_only",
});

export const logPosthog = (
  eventName:
    | "Mute"
    | "Start"
    | "Single Race"
    | "Play Track"
    | "Select Track"
    | "Select Voice"
    | "Start Race"
    | "Choose Opponent"
    | "Unlock Race",
  value: any
) => {
  posthog.capture(eventName, value);
};
