"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, History, Star, Bell, HelpCircle, User, Edit3, Settings } from "lucide-react";

const ProfileDashboard = () => {
  const [name, setName] = useState("Sophia");
  const [email, setEmail] = useState("sophia@example.com");
  const [status, setStatus] = useState("");
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [activeSection, setActiveSection] = useState("profile");

  const sidebarItems = [
    { icon: Plus, label: "New chat", id: "new" },
    { icon: History, label: "History", id: "history" },
    { icon: Star, label: "Starred", id: "starred" },
    { icon: Bell, label: "Updates", id: "updates" },
    { icon: HelpCircle, label: "FAQ", id: "faq" },
  ];

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 dark:bg-gray-800 backdrop-blur-sm p-4 flex flex-col justify-between border-r border-gray-200 dark:border-gray-700 shadow-xl">
        <div>
          {/* Profile Header */}
          <div className="flex items-center gap-3 mb-8 p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl border border-gray-300 dark:border-gray-600">
            <Avatar className="w-12 h-12 ring-2 ring-blue-400/30">
              <AvatarImage
                src="https://images.unsplash.com/photo-1494790108755-2616b612b193?w=150&h=150&fit=crop&crop=face"
                alt="Sophia"
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                S
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-gray-900 dark:text-white text-lg font-semibold">Sophia</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Online</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-[1.02]"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile Button */}
        <button
          onClick={() => setActiveSection("profile")}
          className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
            activeSection === "profile"
              ? "bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-lg"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <User size={20} />
          <span className="font-medium">Profile</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                Profile Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account and preferences</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 text-black dark:hover:bg-gray-800">
                <Settings size={16} className="mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-white dark:bg-gray-800 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-2xl">
              <CardContent className="flex flex-col items-center text-center p-8">
                <div className="relative mb-6">
                  <Avatar className="w-36 h-36 ring-4 ring-gradient-to-r from-blue-400 to-purple-400 ring-offset-4 ring-offset-slate-800">
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b193?w=200&h=200&fit=crop&crop=face"
                      alt="Sophia"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-3xl font-bold">
                      S
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute bottom-2 right-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                  >
                    <Edit3 size={16} />
                  </Button>
                </div>
                <h2 className="text-gray-900 dark:text-white text-3xl font-bold mb-2">Sophia</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Joined in 2023</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-emerald-600/20 text-emerald-400 rounded-full text-sm border border-emerald-600/30">
                    Active
                  </span>
                  <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm border border-blue-600/30">
                    Premium
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Information Card */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-gray-800 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-2xl">
              <CardContent className="p-8">
                {/* Personal Information */}
                <section className="mb-10">
                  <h3 className="text-gray-900 dark:text-white text-2xl font-bold mb-6 flex items-center gap-2">
                    <User size={24} className="text-blue-400" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-400 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-400 transition-colors"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="status" className="text-gray-700 dark:text-gray-300 font-medium">
                        Status Message
                      </Label>
                      <Input
                        id="status"
                        placeholder="What's on your mind?"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-400 transition-colors"
                      />
                    </div>
                  </div>
                </section>

                {/* Privacy Settings */}
                <section className="mb-8">
                  <h3 className="text-gray-900 dark:text-white text-2xl font-bold mb-6 flex items-center gap-2">
                    <Settings size={24} className="text-purple-400" />
                    Privacy & Security
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-6 bg-gray-100 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600/30">
                      <div>
                        <p className="text-gray-900 dark:text-white font-semibold text-lg">Profile Visibility</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                          Control who can see your profile information
                        </p>
                      </div>
                      <Switch
                        checked={profileVisibility}
                        onCheckedChange={setProfileVisibility}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>
                    <div className="flex items-center justify-between p-6 bg-gray-100 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600/30">
                      <div>
                        <p className="text-gray-900 dark:text-white font-semibold text-lg">Data Management</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                          Download, export, or delete your account data
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="border-gray-300 dark:border-gray-600 text-black hover:text-gray-900 "
                      >
                        Manage Data
                      </Button>
                    </div>
                  </div>
                </section>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700/50">
                  <Button 
                    variant="outline" 
                    className="border-gray-300 dark:border-gray-600 text-black"
                  >
                    Cancel
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileDashboard;