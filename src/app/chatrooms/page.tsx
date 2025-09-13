"use client";

import Link from "next/link";
import { useChatStore } from "@/store/chatStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isValid } from "date-fns";
import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Calendar,
  Trash2,
  Search,
  ArrowUpDown,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";

export default function ChatroomList() {
  const { chatrooms, deleteChatRoom, loading } = useChatStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const itemsPerPage = 6;

  const handleDelete = async (id: string) => {
    try {
      await deleteChatRoom(id);
      toast.success("Chat room deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete chat room");
    }
  };

  const formatCreatedAt = (createdAt: string): string => {
    try {
      const date = new Date(createdAt);
      if (!isValid(date)) {
        return "Invalid date";
      }
      return format(date, "MMM dd, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const filteredAndSortedChatrooms = useMemo(() => {
    return chatrooms
      .filter((room) =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        if (!isValid(dateA) && !isValid(dateB)) return 0;
        if (!isValid(dateA)) return 1;
        if (!isValid(dateB)) return -1;
        return sortOrder === "desc"
          ? dateB.getTime() - dateA.getTime()
          : dateA.getTime() - dateB.getTime();
      });
  }, [chatrooms, searchQuery, sortOrder]);

  const totalPages = Math.ceil(
    filteredAndSortedChatrooms.length / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentChatrooms = filteredAndSortedChatrooms.slice(
    startIndex,
    endIndex
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    setCurrentPage(1); // Reset to first page on sort change
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Chatrooms</h1>
          <p className="text-gray-400">
            Create and join chatrooms to start conversations
          </p>
        </div>

        {/* Search and Sort Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search chatrooms..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              aria-label="Search chatrooms by name"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-gray-200"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={toggleSortOrder}
            className="border-gray-600 text-black hover:bg-blue-900/30 hover:text-blue-400 transition-all duration-300"
            aria-label={`Sort by date ${
              sortOrder === "desc" ? "ascending" : "descending"
            }`}
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sort by Date ({sortOrder === "desc" ? "Newest" : "Oldest"})
          </Button>
        </div>

        {/* Chatrooms List */}
        <Card className="bg-gray-900 border border-gray-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-900/20 to-purple-900/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-800/30 rounded-lg">
                <MessageCircle className="h-5 w-5 text-blue-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-100">
                Your Chatrooms
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {currentChatrooms.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-100 mb-2">
                  {searchQuery ? "No matching chatrooms" : "No chatrooms yet"}
                </h3>
                <p className="text-gray-400">
                  {searchQuery
                    ? "Try a different search term"
                    : "Create your first chatroom to get started"}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {currentChatrooms.map((room) => (
                    <div
                      key={room.id}
                      className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <Link href={`/chatrooms/${room.id}`}>
                            <h3 className="font-semibold text-gray-100 text-lg group-hover:text-blue-400 transition-colors duration-300">
                              {room.name}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                            <Calendar className="h-3 w-3" />
                            <span>{formatCreatedAt(room.createdAt)}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(room.id)}
                          disabled={loading}
                          className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-900/30 rounded-lg transition-all duration-300"
                          aria-label={`Delete chatroom ${room.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Link href={`/chatrooms/${room.id}`}>
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-[1.02]">
                          Join Chatroom
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-gray-700 pt-4">
                    <div className="text-sm text-gray-300">
                      Showing {startIndex + 1} to{" "}
                      {Math.min(endIndex, filteredAndSortedChatrooms.length)} of{" "}
                      {filteredAndSortedChatrooms.length} chatrooms
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="border-gray-600 text-black bg-white transition-all duration-300"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <Button
                            key={page}
                            variant={
                              page === currentPage ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => goToPage(page)}
                            className={`w-8 h-8 p-0 ${
                              page === currentPage
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                : "border-gray-600 text-gray-200 bg-blue-900/30 hover:text-blue-400"
                            } transition-all duration-300`}
                            aria-label={`Page ${page}`}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="border-gray-600 text-black bg-white hover:bg-blue-900/30 hover:text-blue-400 transition-all duration-300"
                        aria-label="Next page"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
