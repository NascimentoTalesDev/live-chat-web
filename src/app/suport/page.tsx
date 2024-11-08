// pages/client.tsx
"use client"
import ChatBoxClient from "@/components/ui/ChatBoxClient";
import React, { useState } from "react";

const ClientPage: React.FC = () => {
  const [role] = useState<"client">("client");

  return (
    <div className="h-full w-full">
        <ChatBoxClient role={role} />
    </div>
  );
};

export default ClientPage;

