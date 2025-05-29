
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Minimize2, Maximize2, Loader2 } from "lucide-react";
import { ChatMessage } from "../types/Resource";
import { BASE_URL, API_HEADERS } from "../constants/api";
import { toast } from "@/hooks/use-toast";
import MarkdownView from "./MarkdownView";

interface ChatDockProps {
  contextId: string;
}

const ChatDock: React.FC<ChatDockProps> = ({ contextId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuery, setCurrentQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input when chat opens
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const sendQuery = async () => {
    if (!currentQuery.trim() || isLoading) return;

    const query = currentQuery.trim();
    setCurrentQuery("");
    setIsLoading(true);

    // Add user message immediately
    const userMessageId = Date.now().toString();
    const userMessage: ChatMessage = {
      id: userMessageId,
      query,
      response: "",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const url = contextId === "home" 
        ? `${BASE_URL}/resource_query`
        : `${BASE_URL}/resource_query?resource_id=${contextId}`;

      const response = await fetch(url, {
        method: "POST",
        headers: API_HEADERS,
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Query failed: ${response.status}`);
      }

      const responseText = await response.text();

      // Update the message with the response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessageId 
            ? { ...msg, response: responseText }
            : msg
        )
      );

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Query failed";
      
      // Update message with error
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessageId 
            ? { ...msg, response: `Error: ${errorMessage}` }
            : msg
        )
      );

      toast({
        title: "Query Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuery();
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[min(600px,90vw)] z-50">
      <Card className={`transition-all duration-300 shadow-2xl border-0 bg-white/95 backdrop-blur-md ${
        isOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-100"
      }`}>
        {/* Header */}
        <CardHeader 
          className="pb-3 cursor-pointer flex flex-row items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            <CardTitle className="text-lg">
              AI Assistant {contextId !== "home" && `• User Context`}
            </CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-white hover:bg-white/20 p-1"
          >
            {isOpen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </CardHeader>

        {/* Chat Area */}
        {isOpen && (
          <CardContent className="p-0">
            <div className="flex flex-col h-96">
              {/* Messages */}
              <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">
                      {contextId === "home" 
                        ? "Ask me about resources and team members..."
                        : "Ask me about this team member..."
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="space-y-2">
                        {/* User Query */}
                        <div className="flex justify-end">
                          <div className="bg-blue-500 text-white p-3 rounded-lg max-w-[80%] break-words">
                            {message.query}
                          </div>
                        </div>
                        
                        {/* Assistant Response */}
                        {message.response && (
                          <div className="flex justify-start">
                            <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
                              <MarkdownView md={message.response} />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t bg-gray-50 p-4">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={currentQuery}
                    onChange={(e) => setCurrentQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button 
                    onClick={sendQuery}
                    disabled={!currentQuery.trim() || isLoading}
                    size="icon"
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ChatDock;
