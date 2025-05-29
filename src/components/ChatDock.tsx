
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, X, MessageCircle, Trash2 } from "lucide-react";
import { ChatMessage } from "../types/Resource";
import { BASE_URL, API_HEADERS } from "../constants/api";
import { toast } from "@/hooks/use-toast";
import MarkdownView from "./MarkdownView";

interface ChatDockProps {
  contextId: string;
}

const ChatDock: React.FC<ChatDockProps> = ({ contextId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuery, setCurrentQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMessagesVisible, setIsMessagesVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Show messages when a new message is added
  useEffect(() => {
    if (messages.length > 0) {
      setIsMessagesVisible(true);
    }
  }, [messages.length]);

  // Close chat when contextId changes (navigating to different pages)
  useEffect(() => {
    setIsMessagesVisible(false);
  }, [contextId]);

  const sendQuery = async () => {
    if (!currentQuery.trim() || isLoading) return;

    const query = currentQuery.trim();
    setCurrentQuery("");
    setIsLoading(true);

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

      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessageId 
            ? { ...msg, response: responseText }
            : msg
        )
      );

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Query failed";
      
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

  const hideMessages = () => {
    setIsMessagesVisible(false);
  };

  const showMessages = () => {
    setIsMessagesVisible(true);
  };

  const clearMessages = () => {
    setMessages([]);
    setIsMessagesVisible(false);
  };

  const hasMessages = messages.length > 0;
  const showMessagesArea = hasMessages && isMessagesVisible;

  return (
    <>
      {/* Background Blur Overlay - only visible when messages are shown */}
      {showMessagesArea && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/10 pointer-events-none z-30" />
      )}

      {/* Show Messages Button - only when messages exist but are hidden */}
      {hasMessages && !isMessagesVisible && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-40">
          <Button
            onClick={showMessages}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Show Chat ({messages.length})
          </Button>
        </div>
      )}

      {/* Floating Messages */}
      {showMessagesArea && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 w-[min(700px,92vw)] max-h-[65vh] overflow-y-auto z-40 pointer-events-none">
          <div className="space-y-4 p-6">
            {/* Control Buttons */}
            <div className="flex justify-end gap-2 pointer-events-auto">
              <Button
                onClick={clearMessages}
                variant="ghost"
                size="icon"
                className="bg-white/90 backdrop-blur-md hover:bg-red-50/95 shadow-lg border border-white/30 rounded-full h-8 w-8 text-red-600 hover:text-red-800"
                title="Clear chat history"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                onClick={hideMessages}
                variant="ghost"
                size="icon"
                className="bg-white/90 backdrop-blur-md hover:bg-white/95 shadow-lg border border-white/30 rounded-full h-8 w-8 text-gray-600 hover:text-gray-800"
                title="Hide chat"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {messages.map((message) => (
              <div key={message.id} className="space-y-3 animate-fade-in">
                {/* User Query */}
                <div className="flex justify-end pointer-events-auto">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 backdrop-blur-md text-white p-4 rounded-2xl max-w-[85%] break-words shadow-xl border border-blue-500/20">
                    <div className="text-sm font-medium">{message.query}</div>
                  </div>
                </div>
                
                {/* Assistant Response */}
                {message.response && (
                  <div className="flex justify-start pointer-events-auto">
                    <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl max-w-[85%] shadow-xl border border-gray-200/50">
                      <MarkdownView md={message.response} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[min(700px,92vw)] z-50">
        <div className="bg-white/95 backdrop-blur-lg shadow-2xl border border-gray-200/30 rounded-3xl p-5">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={currentQuery}
                onChange={(e) => setCurrentQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={contextId === "home" 
                  ? "Ask me about resources and team members..."
                  : "Ask me about this team member..."
                }
                disabled={isLoading}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-gray-500 font-medium"
              />
            </div>
            
            <Button 
              onClick={sendQuery}
              disabled={!currentQuery.trim() || isLoading}
              size="icon"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-2xl shadow-lg transition-all duration-200 hover:scale-105 h-11 w-11"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatDock;
