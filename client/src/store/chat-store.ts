import { Conversation } from '@/lib/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ConversationStore {
    conversations: Conversation[];
    activeId: string | undefined;
    activeConversation: Conversation | undefined;
    addConversation: (conversation: Conversation) => void;
    addConversations: (conversations: Conversation[]) => void;
    setConversations: (conversations: Conversation[]) => void;
    removeConversation: (id: string) => void;
    clearConversations: () => void;
    setActiveConversation: (id: string) => void;
    updateActiveConversation: (updatedConversation: Partial<Conversation>) => void;
    deleteMessage: (messageId: string) => void;
}

export const useConversationStore = create<ConversationStore>()(
    persist(
        (set) => ({
            conversations: [],
            activeId: undefined,
            activeConversation: undefined,
            addConversation: (conversation) => {
                set((state) => {
                    const existingConversationIndex = state.conversations.findIndex((s) => s.id === conversation.id);
                    if (existingConversationIndex !== -1) {
                        const updatedConversations = [...state.conversations];
                        updatedConversations[existingConversationIndex] = conversation;
                        return {
                            conversations: updatedConversations,
                            activeConversation: conversation,
                        };
                    } else {
                        return {
                            conversations: [conversation, ...state.conversations],
                            activeConversation: conversation,
                        };
                    }
                });
            },
            addConversations: (newConversations) => {
                set((state) => {
                    if (state.conversations.length === 0) {
                        return { conversations: newConversations };
                    }

                    const combinedConversations = [...state.conversations, ...newConversations];

                    const uniqueIds = new Set();
                    const uniqueConversations = [];

                    for (const conversation of combinedConversations) {
                        const conversationId = conversation.id;
                        if (!uniqueIds.has(conversationId)) {
                            uniqueIds.add(conversationId);
                            uniqueConversations.push(conversation);
                        }
                    }

                    const updatedConversations = uniqueConversations.sort((a, b) => {
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    });

                    return { conversations: updatedConversations };
                });
            },
            setConversations: (conversations) => set({ conversations }),
            removeConversation: (id) => {
                set((state) => ({
                    conversations: state.conversations.filter((conversation) => conversation.id !== id),
                }));
            },
            clearConversations: () => {
                set({ conversations: [] });
            },
            setActiveConversation: (id) => {
                set((state) => {
                    const conversation = state.conversations.find((s) => s.id === id);
                    return { activeConversation: conversation || undefined, activeId: id };
                });
            },
            updateActiveConversation: (updatedConversation) => {
                set((state) => {
                    if (!state.activeConversation) return state;
                    const newConversation = {
                        ...state.activeConversation,
                        ...updatedConversation,
                    };
                    return {
                        activeConversation: newConversation,
                        conversations: state.conversations.map((s) => (s.id === newConversation.id ? newConversation : s)),
                    };
                });
            },
            deleteMessage: (messageId) => {
                set((state) => {
                    if (!state.activeConversation) return state;
                    const newMessages = state.activeConversation.messages.filter((m) => m.id !== messageId);
                    const newSearch = {
                        ...state.activeConversation,
                        messages: newMessages,
                    };
                    return {
                        activeConversation: newSearch,
                        conversations: state.conversations.map((s) => (s.id === newSearch.id ? newSearch : s)),
                    };
                });
            },
        }),
        {
            name: 'conversation-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                activeId: state.activeId,
                activeConversation: state.activeConversation,
                conversations: state.conversations.slice(0, 100),
            }),
        },
    ),
);
