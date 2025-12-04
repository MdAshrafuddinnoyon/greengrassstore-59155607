import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, MessageSquare, FileText, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { CustomRequestModal } from "@/components/custom-request/CustomRequestModal";

const WHATSAPP_URL = "https://wa.me/+971547751901";

export const FloatingActionMenu = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showCustomRequest, setShowCustomRequest] = useState(false);
  const [showWhatsAppChat, setShowWhatsAppChat] = useState(false);
  const [showSalesAgent, setShowSalesAgent] = useState(false);
  const [whatsAppMessage, setWhatsAppMessage] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleWhatsApp = () => {
    setIsOpen(false);
    const message = "Hello! I'm interested in your products. Can you help me?";
    const encodedMessage = encodeURIComponent(message);
    window.open(`${WHATSAPP_URL}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
  };

  const handleCustomRequest = () => {
    setIsOpen(false);
    if (!user) {
      toast.error(isArabic ? "يرجى تسجيل الدخول أولاً" : "Please login first to submit a custom request");
      return;
    }
    setShowCustomRequest(true);
  };

  const handleSalesAgent = () => {
    setIsOpen(false);
    setShowSalesAgent(true);
  };

  const menuItems = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      ),
      label: "WhatsApp",
      color: "bg-[#25D366]",
      onClick: handleWhatsApp,
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: isArabic ? "مساعد المبيعات" : "Sales Agent",
      color: "bg-[#2d5a3d]",
      onClick: handleSalesAgent,
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: isArabic ? "طلب مخصص" : "Custom Request",
      color: "bg-primary",
      onClick: handleCustomRequest,
    },
  ];

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-3 sm:bottom-8 sm:right-6 z-50 lg:hidden">
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/20 -z-10"
              />
              
              {/* Menu Items */}
              <div className="absolute bottom-16 right-0 flex flex-col gap-3">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={item.onClick}
                    className="flex items-center gap-3 group"
                  >
                    <span className="bg-background text-foreground text-sm font-medium px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.label}
                    </span>
                    <div className={`w-12 h-12 rounded-full ${item.color} text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                  </motion.button>
                ))}
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Main FAB Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            boxShadow: "0 10px 40px -10px hsl(var(--primary) / 0.5)",
          }}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Desktop floating buttons - shown on larger screens */}
      <div className="hidden lg:block">
        {/* WhatsApp Button */}
        <motion.button
          onClick={handleWhatsApp}
          className="fixed bottom-24 right-6 z-50 flex items-center group"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
        >
          <span className="mr-3 bg-white px-4 py-2 rounded-full shadow-lg text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
            Chat on WhatsApp
          </span>
          <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-7 h-7">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </div>
        </motion.button>

        {/* Sales Agent Button */}
        <motion.button
          onClick={handleSalesAgent}
          className="fixed bottom-8 right-6 z-50 w-14 h-14 rounded-full bg-[#2d5a3d] flex items-center justify-center shadow-lg shadow-[#2d5a3d]/30 text-white hover:scale-110 transition-transform"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.8 }}
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>

        {/* Custom Request Button */}
        <motion.button
          onClick={handleCustomRequest}
          className="fixed bottom-8 left-8 z-50 flex items-center gap-2 h-14 px-4 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-105 transition-transform"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.6 }}
          style={{
            boxShadow: "0 10px 40px -10px hsl(var(--primary) / 0.5)",
          }}
        >
          <FileText className="w-6 h-6" />
          <span className="font-medium hidden xl:inline">
            {isArabic ? "طلب مخصص" : "Custom Request"}
          </span>
        </motion.button>
      </div>

      {/* Sales Agent Modal */}
      <SalesAgentModal isOpen={showSalesAgent} onClose={() => setShowSalesAgent(false)} />

      {/* Custom Request Modal */}
      <CustomRequestModal
        isOpen={showCustomRequest}
        onClose={() => setShowCustomRequest(false)}
        user={user ? { id: user.id, email: user.email || "" } : null}
      />
    </>
  );
};

// Sales Agent Modal Component
const SalesAgentModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: "user" | "agent"; timestamp: Date }>>([
    {
      id: "1",
      text: "Hello! 👋 Welcome to Green Grass Store. I'm your virtual assistant. How can I help you today?",
      sender: "agent",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const getAgentResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes("plant") || message.includes("monstera") || message.includes("snake")) {
      return "We have a wonderful collection of plants including Snake Plants, Monstera, Peace Lily, Ficus, and many more! 🌿";
    }
    if (message.includes("pot") || message.includes("vase") || message.includes("ceramic")) {
      return "Our pot collection includes ceramic pots, terracotta pots, modern planters, and decorative vases. 🏺";
    }
    if (message.includes("deliver") || message.includes("shipping") || message.includes("dubai")) {
      return "Yes! We deliver across Dubai and all UAE emirates. 🚚 Free delivery on orders above AED 200.";
    }
    if (message.includes("price") || message.includes("cost") || message.includes("how much")) {
      return "Our prices start from AED 25 for small plants and AED 35 for basic pots. 💰";
    }
    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return "Hello! 👋 Welcome to Green Grass! How can I assist you today?";
    }
    if (message.includes("thank")) {
      return "You're welcome! 😊 Feel free to ask if you have any more questions. Happy shopping! 🌱";
    }
    
    return "I'd be happy to help! Could you please provide more details? 🌿";
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user" as const,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const agentMessage = {
        id: (Date.now() + 1).toString(),
        text: getAgentResponse(text),
        sender: "agent" as const,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-0 right-0 left-0 sm:bottom-6 sm:right-6 sm:left-auto z-[60] w-full sm:w-[380px] h-[100dvh] sm:h-[550px] sm:max-h-[80vh] bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border-0 sm:border sm:border-gray-200"
        >
          {/* Header */}
          <div className="bg-[#2d5a3d] px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Sales Assistant</h3>
                <p className="text-xs text-white/80">Online • Ready to help</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-[#2d5a3d] text-white rounded-br-md"
                      : "bg-white text-gray-800 rounded-bl-md shadow-sm"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 items-center">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="flex gap-2"
            >
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]/50"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="w-10 h-10 rounded-full bg-[#2d5a3d] hover:bg-[#234830] text-white flex items-center justify-center disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            {/* Powered by */}
            <p className="text-center text-xs text-gray-400 mt-3">
              Powered by{" "}
              <a
                href="https://www.websearchbd.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2d5a3d] hover:underline font-medium"
              >
                Web Search BD
              </a>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
