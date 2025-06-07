import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Send,
  RefreshCcw,
  Trophy,
  Package,
  FileText,
  PhoneCall,
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  ThumbsUp,
  X,
  Info,
  HelpCircle,
  AlertCircle
} from "lucide-react";
import "./Chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "👋 Welcome to Sportalon! How can I assist you today?", sender: "bot", animate: true },
    { text: "How to Use", sender: "bot", type: "option", icon: "guide" },
    { text: "Equipments", sender: "bot", type: "option", icon: "equipment" },
    { text: "Current Events", sender: "bot", type: "option", icon: "event" },
    { text: "Contact Admin", sender: "bot", type: "option", icon: "contact" },
  ]);
  const [input, setInput] = useState("");
  const [equipments, setEquipments] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [awaitingAdminMessage, setAwaitingAdminMessage] = useState(false);
  const [theme, setTheme] = useState("light"); // For theme toggling
  const [suggestions, setSuggestions] = useState([]); // For smart suggestions
  const [userProfile, setUserProfile] = useState(null); // For personalized responses
  const [notificationCount, setNotificationCount] = useState(0); // For chat notifications
  const [isTyping, setIsTyping] = useState(false); // For typing indicator
  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Focus input when chat opens
    setTimeout(() => {
      if (inputRef.current && !isOpen) {
        inputRef.current.focus();
      }
    }, 300);
  };

  useEffect(() => {
    setLoading(true);

    // Fetch equipment data
    axios.get("https://sportalon-backend.onrender.com/api/user/equipment")
      .then((res) => {
        console.log("Equipment API Response:", res.data);
        if (res.data && res.data.data) {
          setEquipments(res.data.data);
        } else {
          console.error("Unexpected equipment data format:", res.data);
        }
      })
      .catch((error) => console.error("API Error (Equipments):", error));

    // Fetch events data
    axios.get("https://sportalon-backend.onrender.com/api/user/getevent")
      .then((res) => {
        console.log("Events API Response:", res.data);
        if (res.data && res.data.events) {
          setEvents(res.data.events);
        } else {
          console.error("Unexpected events data format:", res.data);
        }
      })
      .catch((error) => console.error("API Error (Events):", error))
      .finally(() => setLoading(false));

    // Simulate notifications after a delay
    const timer = setTimeout(() => {
      if (!isOpen) {
        setNotificationCount(2);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Effect to clear notifications when chat opens
  useEffect(() => {
    if (isOpen && notificationCount > 0) {
      setNotificationCount(0);
    }
  }, [isOpen, notificationCount]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const getIconComponent = (iconType, size = 16) => {
    switch (iconType) {
      case 'guide':
        return <FileText size={size} className="option-icon" />;
      case 'equipment':
        return <Package size={size} className="option-icon" />;
      case 'event':
        return <Trophy size={size} className="option-icon" />;
      case 'contact':
        return <PhoneCall size={size} className="option-icon" />;
      case 'activity':
        return <Users size={size} className="option-icon" />;
      case 'calendar':
        return <Calendar size={size} className="option-icon" />;
      case 'location':
        return <MapPin size={size} className="option-icon" />;
      case 'time':
        return <Clock size={size} className="option-icon" />;
      case 'rating':
        return <Star size={size} className="option-icon" />;
      case 'like':
        return <ThumbsUp size={size} className="option-icon" />;
      case 'info':
        return <Info size={size} className="option-icon" />;
      case 'help':
        return <HelpCircle size={size} className="option-icon" />;
      case 'alert':
        return <AlertCircle size={size} className="option-icon" />;
      default:
        return null;
    }
  };

  // Simulate typing effect
  const simulateTyping = (callback) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, 1000);
  };

  // Generate smart suggestions based on user input
  const generateSuggestions = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    const suggestions = [];

    if (lowerInput.includes('equip') || lowerInput.includes('gear')) {
      suggestions.push('Equipments');
    }
    if (lowerInput.includes('event') || lowerInput.includes('tournament')) {
      suggestions.push('Current Events');
    }
    if (lowerInput.includes('help') || lowerInput.includes('guide')) {
      suggestions.push('How to Use');
    }
    if (lowerInput.includes('admin') || lowerInput.includes('contact')) {
      suggestions.push('Contact Admin');
    }

    return suggestions.slice(0, 3); // Limit to 3 suggestions
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { text, sender: "user" }]);
    setInput("");

    // Generate suggestions based on user input
    const newSuggestions = generateSuggestions(text);
    setSuggestions(newSuggestions);

    // Show typing indicator
    setIsTyping(true);

    // Process different commands
    if (text === "How to Use") {
      simulateTyping(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "Welcome to Sportalon! Here's how to get started:",
            sender: "bot",
            animate: true
          },
          {
            text: "• Browse equipment availability and request what you need",
            sender: "bot"
          },
          {
            text: "• Check out upcoming sports events and register",
            sender: "bot"
          },
          {
            text: "• Contact admin for any special requests",
            sender: "bot"
          }
        ]);
      });
    }
    else if (text === "Equipments") {
      simulateTyping(() => {
        if (equipments && equipments.length > 0) {
          setMessages((prev) => [
            ...prev,
            {
              text: "Choose equipment to check availability:",
              sender: "bot",
              animate: true
            },
            ...equipments.map((eq) => ({
              text: eq.equipmentname,
              sender: "bot",
              type: "option",
              icon: "equipment",
              equipmentId: eq._id
            })),
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              text: "No equipment is currently available in the inventory.",
              sender: "bot",
              animate: true
            },
            {
              text: "Please check back later or contact admin for assistance.",
              sender: "bot"
            },
            {
              text: "Contact Admin",
              sender: "bot",
              type: "action",
              action: "contactAdmin"
            }
          ]);
        }
      });
    }
    else if (text === "Current Events") {
      simulateTyping(() => {
        if (events && events.length > 0) {
          setMessages((prev) => [
            ...prev,
            {
              text: "Here are the upcoming sports events:",
              sender: "bot",
              animate: true
            },
            ...events.map((event) => ({
              text: event.title,
              sender: "bot",
              type: "event",
              id: event._id,
              icon: "event"
            }))
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              text: "No events are currently scheduled.",
              sender: "bot",
              animate: true
            },
            {
              text: "Please check back later for upcoming events.",
              sender: "bot"
            }
          ]);
        }
      });
    }
    else if (text === "Popular Activities") {
      simulateTyping(() => {
        // Sample popular activities - in a real app, these would come from an API
        const popularActivities = [
          { name: "Basketball Pickup Games", participants: 24, location: "Main Court" },
          { name: "Weekend Soccer League", participants: 32, location: "Field A" },
          { name: "Morning Yoga Sessions", participants: 15, location: "Studio 3" },
          { name: "Swimming Club", participants: 18, location: "Olympic Pool" },
          { name: "Tennis Tournaments", participants: 16, location: "Tennis Courts" }
        ];

        setMessages((prev) => [
          ...prev,
          {
            text: "🔥 Most popular activities this week:",
            sender: "bot",
            animate: true,
            isHeader: true
          },
          ...popularActivities.map(activity => ({
            text: `${activity.name} (${activity.participants} participants)`,
            sender: "bot",
            type: "activity",
            location: activity.location,
            icon: "activity"
          })),
          {
            text: "Join an Activity",
            sender: "bot",
            type: "action",
            action: "joinActivity"
          },
          {
            text: "Create New Activity",
            sender: "bot",
            type: "action",
            action: "createActivity"
          }
        ]);
      });
    }
    else if (text === "Contact Admin") {
      simulateTyping(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "Type your message for the admin below:",
            sender: "bot",
            animate: true
          }
        ]);
        setAwaitingAdminMessage(true);
      });
    }
    // Removed handling for common questions
    else if (awaitingAdminMessage) {
      // Show typing indicator
      setMessages((prev) => [...prev, { text: "Sending message...", sender: "bot", isTyping: true }]);

      // Simulate sending the message to the admin
      axios.post("https://sportalon-backend.onrender.com/api/admin/contact", { message: text })
        .then(() => {
          // Remove typing indicator and add success message
          setMessages((prev) => {
            const filtered = prev.filter(msg => !msg.isTyping);
            return [
              ...filtered,
              {
                text: "✅ Your message has been sent to the admin. They will get back to you soon!",
                sender: "bot",
                animate: true
              },
              {
                text: "Is there anything else I can help you with?",
                sender: "bot"
              },
              {
                text: "Back to Main Menu",
                sender: "bot",
                type: "action",
                action: "restart"
              }
            ];
          });
        })
        .catch(() => {
          // Remove typing indicator and add error message
          setMessages((prev) => {
            const filtered = prev.filter(msg => !msg.isTyping);
            return [
              ...filtered,
              {
                text: "❌ Failed to send message. Please try again later or contact support directly.",
                sender: "bot"
              },
              {
                text: "Try Again",
                sender: "bot",
                type: "action",
                action: "contactAdmin"
              }
            ];
          });
        });
      setAwaitingAdminMessage(false);
    }
    else {
      const selectedEquipment = equipments.find((eq) => eq.equipmentname === text);
      const selectedEvent = events.find((event) => event.title === text);

      if (selectedEquipment) {
        simulateTyping(() => {
          const availability = selectedEquipment.availableQuantity > 0
            ? `Available: ${selectedEquipment.availableQuantity}`
            : "Currently unavailable";

          setMessages((prev) => [
            ...prev,
            {
              text: text,
              sender: "bot",
              isHeader: true,
              animate: true
            },
            {
              text: `${availability}`,
              sender: "bot"
            },
            {
              text: "⭐ Rating: 4.8/5",
              sender: "bot",
              icon: "rating"
            },
            {
              text: "📅 Most popular on weekends",
              sender: "bot",
              icon: "calendar"
            },
            {
              text: "Request Equipment",
              sender: "bot",
              type: "action",
              action: "reserve",
              equipmentId: selectedEquipment._id
            },
            {
              text: "Back to Equipment List",
              sender: "bot",
              type: "action",
              action: "equipmentList"
            }
          ]);
        });
      }
      else if (selectedEvent) {
        simulateTyping(() => {
          // Format dates properly
          const startDate = new Date(selectedEvent.startDate);
          const formattedDate = startDate.toLocaleDateString();
          const formattedTime = startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

          // Show event details
          setMessages((prev) => [
            ...prev,
            {
              text: selectedEvent.title,
              sender: "bot",
              isHeader: true,
              animate: true
            },
            {
              text: `📅 Date: ${formattedDate}`,
              sender: "bot",
              icon: "calendar"
            },
            {
              text: `⏰ Time: ${formattedTime}`,
              sender: "bot",
              icon: "time"
            },
            {
              text: `📍 Location: ${selectedEvent.location}`,
              sender: "bot",
              icon: "location"
            },
            {
              text: `👥 Organizer: ${selectedEvent.organizer}`,
              sender: "bot"
            },
            {
              text: "View Event Details",
              sender: "bot",
              type: "action",
              action: "viewEvent",
              eventId: selectedEvent._id
            },
            {
              text: "Register for Event",
              sender: "bot",
              type: "action",
              action: "registerEvent",
              eventId: selectedEvent._id
            },
            {
              text: "Back to Events List",
              sender: "bot",
              type: "action",
              action: "eventsList"
            }
          ]);
        });
      }
      else {
        simulateTyping(() => {
          setMessages((prev) => [
            ...prev,
            {
              text: "I'm not sure about that. Would you like to:",
              sender: "bot",
              animate: true
            },
            {
              text: "Check Equipment",
              sender: "bot",
              type: "option",
              icon: "equipment"
            },
            {
              text: "View Events",
              sender: "bot",
              type: "option",
              icon: "event"
            },

            {
              text: "Contact Admin",
              sender: "bot",
              type: "option",
              icon: "contact"
            }
          ]);
        });
      }
    }
  };

  const restartChat = () => {
    setMessages([
      { text: "👋 Welcome to Sportalon! How can I assist you today?", sender: "bot", animate: true },
      { text: "How to Use", sender: "bot", type: "option", icon: "guide" },
      { text: "Equipments", sender: "bot", type: "option", icon: "equipment" },
      { text: "Current Events", sender: "bot", type: "option", icon: "event" },
      { text: "Contact Admin", sender: "bot", type: "option", icon: "contact" },
    ]);
    setInput("");
    setAwaitingAdminMessage(false);
    setSuggestions([]);
    setIsTyping(false);
  };

  // Handle action buttons
  const handleAction = (action, data) => {
    switch(action) {
      case "restart":
        restartChat();
        break;
      case "reserve":
        // Redirect to equipment request page
        window.location.href = `http://localhost:5173/equipment/${data.equipmentId}`;
        break;
      case "equipmentList":
        // Show equipment list again
        sendMessage("Equipments");
        break;
      case "viewEvent":
      case "registerEvent":
        // Redirect to event details/registration page
        window.location.href = `http://localhost:5173/events/${data.eventId}`;
        break;
      case "eventsList":
        // Show events list again
        sendMessage("Current Events");
        break;
      case "contactAdmin":
        sendMessage("Contact Admin");
        break;
      case "download":
        window.open("https://play.google.com/store", "_blank");
        break;
      case "guides":
        window.open("/guides/sportalon-user-guide.pdf", "_blank");
        break;
      case "createEvent":
        window.location.href = "/events/create";
        break;
      case "viewEquipment":
        // Show equipment list
        sendMessage("Equipments");
        break;
      case "joinActivity":
      case "createActivity":
        simulateTyping(() => {
          setMessages(prev => [
            ...prev,
            {
              text: "This feature is coming soon! We're working on making it available in the next update.",
              sender: "bot",
              animate: true
            }
          ]);
        });
        break;
      default:
        break;
    }
  };

  // Removed theme toggle functionality

  return (
    <div className="chatbot-container">
      {/* Notification badge */}
      {!isOpen && notificationCount > 0 && (
        <div className="notification-badge">{notificationCount}</div>
      )}

      {/* Chat button */}
      <button
        className={`chatbot-button ${isOpen ? 'active' : ''}`}
        onClick={toggleChat}
        aria-label="Open chat assistant"
      >
        <img src="/bot.png" alt="Sportalon Assistant" className="bot-icon" />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="header-left">
              <img src="/bot.png" alt="Sportalon Assistant" className="header-icon" />
              <div className="header-info">
                <span className="header-title">Sportalon Assistant</span>
                <span className="header-status">Online</span>
              </div>
            </div>
            <div className="header-actions">
              <button onClick={toggleChat} aria-label="Close chat">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Chat body */}
          <div className="chat-body" ref={chatBodyRef}>
            {loading && (
              <div className="chat-message bot loading">
                <div className="loading-animation">
                  <div className="loading-spinner"></div>
                  <span>Loading sports information...</span>
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, index) => {
              if (msg.type === "option") {
                return (
                  <div
                    key={index}
                    className={`chat-message bot option ${msg.animate ? 'animate-in' : ''}`}
                    onClick={() => {
                      // If this is an equipment option with ID, store it for later use
                      if (msg.equipmentId) {
                        const equipment = equipments.find(eq => eq._id === msg.equipmentId);
                        if (equipment) {
                          sendMessage(equipment.equipmentname);
                        } else {
                          sendMessage(msg.text);
                        }
                      } else {
                        sendMessage(msg.text);
                      }
                    }}
                  >
                    {msg.icon && getIconComponent(msg.icon)}
                    <span>{msg.text}</span>
                  </div>
                );
              } else if (msg.type === "filter") {
                return (
                  <div
                    key={index}
                    className="chat-message bot filter"
                    onClick={() => sendMessage(msg.text)}
                  >
                    {msg.icon && getIconComponent(msg.icon)}
                    <span>{msg.text}</span>
                  </div>
                );
              } else if (msg.type === "event") {
                return (
                  <div
                    key={index}
                    className={`chat-message bot option ${msg.animate ? 'animate-in' : ''}`}
                    onClick={() => (window.location.href = `http://localhost:5173/events/${msg.id}`)}
                  >
                    <Trophy size={16} className="option-icon" />
                    <span>{msg.text}</span>
                  </div>
                );
              } else if (msg.type === "activity") {
                return (
                  <div
                    key={index}
                    className={`chat-message bot activity ${msg.animate ? 'animate-in' : ''}`}
                  >
                    <Users size={16} className="option-icon" />
                    <div className="activity-content">
                      <span className="activity-name">{msg.text}</span>
                      <span className="activity-location">📍 {msg.location}</span>
                    </div>
                  </div>
                );
              } else if (msg.type === "action") {
                return (
                  <div
                    key={index}
                    className={`chat-message bot action ${msg.animate ? 'animate-in' : ''}`}
                    onClick={() => handleAction(msg.action, {
                      equipmentId: msg.equipmentId,
                      eventId: msg.eventId
                    })}
                  >
                    {msg.icon && getIconComponent(msg.icon)}
                    <span>{msg.text}</span>
                  </div>
                );
              } else {
                return (
                  <div
                    key={index}
                    className={`chat-message ${msg.sender} ${msg.isHeader ? 'header' : ''} ${msg.isTyping ? 'typing' : ''} ${msg.animate ? 'animate-in' : ''}`}
                  >
                    {msg.isTyping ? (
                      <div className="typing-indicator">
                        <span></span><span></span><span></span>
                      </div>
                    ) : (
                      <>
                        {msg.icon && getIconComponent(msg.icon, 18)}
                        <span>{msg.text}</span>
                      </>
                    )}
                  </div>
                );
              }
            })}

            {/* Global typing indicator */}
            {isTyping && (
              <div className="chat-message bot typing">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </div>

          {/* Smart suggestions */}
          {suggestions.length > 0 && (
            <div className="chat-suggestions">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="suggestion-chip"
                  onClick={() => sendMessage(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="chat-footer">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Generate suggestions as user types
                if (e.target.value.length > 2) {
                  setSuggestions(generateSuggestions(e.target.value));
                } else {
                  setSuggestions([]);
                }
              }}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              disabled={loading || isTyping}
              className={isTyping ? 'disabled' : ''}
            />
            <div className="footer-buttons">
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading || isTyping}
                aria-label="Send message"
                className="send-button"
              >
                <Send size={18} />
              </button>
              <button
                className="restart-button"
                onClick={restartChat}
                aria-label="Restart conversation"
                disabled={isTyping}
              >
                <RefreshCcw size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
