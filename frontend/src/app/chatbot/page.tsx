"use client"

import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Input } from '@mui/material';
import { Button } from '@mui/material';

const ChatBot: React.FC = () => {
    return (
        <Card className="w-full h-full max-w-md mx-auto mt-10">
            <CardHeader>
                <CardTitle>Chatbot</CardTitle>
                <CardDescription>Ask me anything!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <div className="bg-gray-100 p-4 rounded-lg">Hello! How can I assist you today?</div>
                </div>
            </CardContent>
            <CardFooter className="flex space-x-2">
                <Input placeholder="Type your message..." className="flex-1" />
                <Button>Send</Button>
            </CardFooter>
        </Card>
    );
};

export default ChatBot;