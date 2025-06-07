import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader';
import MessageSkeleton from './skelton/MessageSkeleton';
import MessageInput from './skelton/MessageInput';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';

const ChatConainerComponent = () => {
  const { messages, getMessages, isMessageLoading, selectedUser, subscribeToMessage, unsubscribeFromMessage } = useChatStore();
  const { authUser } = useAuthStore();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessage();

    return () => {
      unsubscribeFromMessage();
    }
  }, [selectedUser?._id, getMessages]);

  if (isMessageLoading) {
    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    )
  }

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full">
                <img
                  src={message.senderId === authUser._id ? authUser.profilePic || "/user.png" : selectedUser.profilePic || "/user.png"}
                  alt="avatar"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              {message.senderId === authUser._id ? authUser.fullName : selectedUser.fullName}
            </div>
            {message.text && (
              <div className="chat-bubble">{message.text}</div>
            )}
            {message.image && (
              <div className="chat-bubble bg-transparent p-0">
                <img
                  src={message.image}
                  alt="message"
                  className="max-w-[200px] rounded-lg"
                />
              </div>
            )}
            <div className="chat-footer opacity-50">
              {formatMessageTime(message.createdAt)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput />
    </div>
  )
}

export default ChatConainerComponent