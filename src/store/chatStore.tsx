import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Chatroom = {
  id: string;
  name: string;
  createdAt: string; // ISO date string
};

type ChatStore = {
  chatrooms: Chatroom[];
  loading: boolean;
  addChatRoom: (name: string) => Promise<void>;
  deleteChatRoom: (id: string) => Promise<void>;
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      chatrooms: [],
      loading: false,

      addChatRoom: async (name) => {
        set({ loading: true });

        // Simulate async operation (like API call)
        await new Promise((resolve) => setTimeout(resolve, 500));

        const newRoom: Chatroom = {
          id: crypto.randomUUID(),
          name,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          chatrooms: [...state.chatrooms, newRoom],
          loading: false,
        }));
      },

      deleteChatRoom: async (id) => {
        set({ loading: true });

        // Simulate async operation (like API call)
        await new Promise((resolve) => setTimeout(resolve, 500));

        set((state) => ({
          chatrooms: state.chatrooms.filter((room) => room.id !== id),
          loading: false,
        }));
      },
    }),
    {
      name: "chatrooms-storage",
    }
  )
);