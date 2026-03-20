import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [chatHistory, setChatHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('fitforge_chat') || '[]');
    } catch { return []; }
  });

  const [conversations, setConversations] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('fitforge_conversations') || '[]');
    } catch { return []; }
  });

  const [activeConversationId, setActiveConversationId] = useState(null);

  const [savedWorkout, setSavedWorkout] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('fitforge_workout') || 'null');
    } catch { return null; }
  });

  const [savedDiet, setSavedDiet] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('fitforge_diet') || 'null');
    } catch { return null; }
  });

  useEffect(() => {
    localStorage.setItem('fitforge_chat', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem('fitforge_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('fitforge_workout', JSON.stringify(savedWorkout));
  }, [savedWorkout]);

  useEffect(() => {
    localStorage.setItem('fitforge_diet', JSON.stringify(savedDiet));
  }, [savedDiet]);

  function newConversation() {
    const id = Date.now().toString();
    const conv = { id, title: 'New Chat', messages: [], createdAt: new Date().toISOString() };
    setConversations(prev => [conv, ...prev]);
    setActiveConversationId(id);
    setChatHistory([]);
    return id;
  }

  function updateConversation(id, messages) {
    setConversations(prev =>
      prev.map(c =>
        c.id === id
          ? {
              ...c,
              messages,
              title: messages[0]?.content?.slice(0, 40) || 'New Chat',
            }
          : c
      )
    );
  }

  function loadConversation(id) {
    const conv = conversations.find(c => c.id === id);
    if (conv) {
      setChatHistory(conv.messages);
      setActiveConversationId(id);
    }
  }

  return (
    <AppContext.Provider
      value={{
        chatHistory,
        setChatHistory,
        conversations,
        activeConversationId,
        newConversation,
        updateConversation,
        loadConversation,
        savedWorkout,
        setSavedWorkout,
        savedDiet,
        setSavedDiet,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
