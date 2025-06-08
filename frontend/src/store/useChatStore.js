import { create } from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
    messages: [],               
    users: [],
    selectedUser: null,           
    isUserLoading: false,
    isMessageLoading: false,

    setSelectedUser: (user) => {
        set({ selectedUser: user });
    },

    getUsers: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get('messages/users');
            set({ users: res.data });
        } catch(error) {
            toast.error(error.response?.data?.message || "Failed to load users");
        } finally {
            set({ isUserLoading: false });
        } 
    },

    getMessages: async (userId) => {
        if (!userId) return;
        
        set({ isMessageLoading: true, messages: [] });
        try {
            const res = await axiosInstance.get(`messages/${userId}`);
            const sortedMessages = res.data.sort((a, b) => 
                new Date(a.createdAt) - new Date(b.createdAt)
            );
            set({ messages: sortedMessages });
        } catch(error) {
            toast.error(error.response?.data?.message || "Failed to load messages");
        } finally {
            set({ isMessageLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        if (!selectedUser?._id) return;

        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send message");
            throw error;
        }
    },
    
    subscribeToMessage: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) {
            console.log("No socket connection available");
            return;
        }

        // Remove existing listeners
        socket.off("newMessage");
        
        socket.on("newMessage", (newMessage) => {
            console.log("Received new message:", newMessage);
            const { messages, selectedUser } = get();
            const { authUser } = useAuthStore.getState();

            // Check if message is for current chat
            if (
                (newMessage.senderId === selectedUser?._id && newMessage.reciverId === authUser._id) ||
                (newMessage.senderId === authUser._id && newMessage.reciverId === selectedUser?._id)
            ) {
                // Check for duplicates
                const messageExists = messages.some(msg => msg._id === newMessage._id);
                if (!messageExists) {
                    console.log("Adding new message to chat");
                    set({ messages: [...messages, newMessage] });
                }
            }
        });
    },

    unsubscribeFromMessage: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) {
            socket.off("newMessage");
        }
    },
}));