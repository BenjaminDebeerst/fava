import { get as store_get } from "svelte/store";

import { notify, notify_err } from "../notifications.ts";
import { base_url } from "../stores/index.ts";

/**
 * POST to the fava-edit-replay extension so it can replay
 * the last edit on all matching entries.
 * Notifies success or failure itself; never rejects.
 */
export async function apply_to_filtered(): Promise<void> {
  const base = store_get(base_url);
  const params = new URLSearchParams(window.location.search);

  try {
    const response = await fetch(
      `${base}extension/EditReplay/apply_last_edit`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account: params.get("account") || "",
          filter: params.get("filter") || "",
          time: params.get("time") || "",
        }),
      },
    );
    const result = (await response.json()) as { message: string };
    notify(result.message);
  } catch (error) {
    notify_err(error, (err) => `Applying the edit failed: ${err.message}`);
  }
}
