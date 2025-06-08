import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "production" ? "http://localhost:5000" : "http://localhost:5000";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket()


    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

signup: async (data) => {
  set({ isSigningUp: true });
  try {
    const res = await axiosInstance.post("/auth/signup", data);
    set({ authUser: res.data });
    toast.success("Account created successfully");
    get().connectSocket()
  
  } catch (error) {
    const errMsg = error.response?.data?.message || "Signup failed. Please try again.";
    toast.error(errMsg);
  } finally {
    set({ isSigningUp: false });
  }
},

logout: async () => {
  set({ isLoggingIn: false });
  try {
    await axiosInstance.post('auth/logout');
    set({ authUser: null, onlineUsers: [] });
    get().disconnectSocket();
    toast.success("Account logged out successfully");
  } catch(error) {
    toast.error(error.response?.data?.message || "Failed to logout");
  }
},

login: async (data) => {
  
  try {
      const res = await axiosInstance.post('auth/login', data);
      set({authUser: res.data});
      toast.success("Account logged in successfully");
      get().connectSocket()
  } catch(error) {
    toast.error(error.response.data.message);

  }finally {
    set({isLoggingIn: false});
  }
},

updateProfile: async(data) => {
  set({isUpdatingProfile: true});
  try {
    const res = await axiosInstance.put('auth/profile',data);
    set({authUser: res.data});
    toast.success("Profile Updates Successfully");
  }catch(error) {
    toast.error(error.response.data.message);
    console.log("Error in the Update Profileeee")

  } finally {
    set({isUpdatingProfile: false})
  }
},

connectSocket: () => {
  const {authUser} = get()
  if(!authUser) return;

  // Disconnect existing socket if any
  if (get().socket?.connected) {
    get().socket.disconnect();
  }

  const socket = io(BASE_URL, {
    query: {
      userId: authUser._id,
    },
    withCredentials: true,
  }) 
  socket.connect()
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });
  socket.on("getOnlineUsers", (userIds) => {
    console.log("Online users:", userIds);
    set({onlineUsers: userIds})
  });
  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  set({socket: socket});
},
disconnectSocket: () => {
  const socket = get().socket;
  if (socket?.connected) {
    socket.disconnect();
    set({ socket: null, onlineUsers: [] });
  }
},

}));