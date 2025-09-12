"use client";

import { useChatStore } from "@/store/chatStore";
import { useForm } from "react-hook-form";
import { chatroomSchema, ChatroomFormData } from "@/schema/chatSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, isValid } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  MessageSquare,
  Calendar,
  Users,
  Trash2,
  Loader,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Createrooms() {
  const { chatrooms, addChatRoom, deleteChatRoom, loading } = useChatStore();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const form = useForm<ChatroomFormData>({
    resolver: zodResolver(chatroomSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: ChatroomFormData) => {
    await addChatRoom(data.name);
    toast.success("Room created successfully!!")
    form.reset();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Create Chatroom Card */}
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
              <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Create New Chatroom
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                      Chatroom Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                          placeholder="Enter chatroom name"
                          disabled={loading}
                          className="pl-10 py-5 rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium transition-all shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Chatroom
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
