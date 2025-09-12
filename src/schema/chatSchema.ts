import { z } from "zod";

export const chatroomSchema = z.object({
  name: z.string().min(3, "Chatroom name must be at least 3 characters"),
});

export type ChatroomFormData = z.infer<typeof chatroomSchema>;
