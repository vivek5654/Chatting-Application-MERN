import { create } from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'
import { Socket } from 'socket.io-client';
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
            // Sort messages by createdAt
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
            // Add new message to the end of the array
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send message");
            throw error;
        }
    },
    
    subscribeToMessage: () => {
        const {selectedUser} = get();
        if(!selectedUser) return;
        const socket = useAuthStore.getState().socket;
        if(!socket) return;
        
        socket.on("newMessage", (newMessage) => {
            const {messages} = get();
            // Only add message if it's from the selected user or sent by current user
            if(newMessage.senderId === selectedUser._id || newMessage.reciverId === selectedUser._id) {
                set({
                    messages: [...messages, newMessage]
                });
            }
        });
    },

    unsubscribeFromMessage: () => {
        const socket = useAuthStore.getState().socket;
        if(!socket) return;
        socket.off("newMessage");
    },
    }));