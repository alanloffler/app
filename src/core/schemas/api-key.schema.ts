import { z } from "zod";

export const apiKeySchema = z.object({
  apiKey: z.string().min(1, "API Key es obligatoria"),
});
