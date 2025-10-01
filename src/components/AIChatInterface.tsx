import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIChatInterfaceProps {
  onParametersChange?: (params: any) => void;
}

export function AIChatInterface({ onParametersChange }: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your EV charging assistant. Ask me anything about charging scenarios, and I'll help simulate them. Try questions like:\n\n• \"I need to drive from Savannah to Atlanta. What charging session would I need?\"\n• \"How fast would I need to charge to gain 50 miles in 30 minutes?\"\n• \"What would a coffee shop charging session look like?\"",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I understand your query. Let me adjust the charging parameters for you...\n\n[In production, this would connect to an AI service to interpret your question and update the calculator settings accordingly]",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {/* Chat Messages Area */}
      <div className="bg-muted/20 rounded-lg border border-border/50 p-4">
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted border border-border/50"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-foreground/60" />
                      <span className="text-foreground/60">AI Assistant</span>
                    </div>
                  )}
                  <p className="whitespace-pre-line text-sm">{message.content}</p>
                  <span className="text-xs opacity-60 mt-2 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-muted border border-border/50 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-foreground/60" />
                    <span className="text-foreground/60 text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your charging scenario..."
            className="min-h-[80px] pr-12 resize-none"
            disabled={isProcessing}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isProcessing}
            className="absolute bottom-2 right-2"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-sm text-foreground/50">
          The AI will interpret your question and adjust the calculator parameters automatically.
        </p>
      </form>
    </div>
  );
}