import { createChatBotMessage } from 'react-chatbot-kit';
import React from 'react';

const MessageParser = ({ children, actions }) => {
  const createUserMessage = (text) => createChatBotMessage({
    text,
    user: true,
    avatar: '',
  });

  const parse = (message) => {
    if (message.includes('hello ') || message.includes('hi ')) {
      actions.handleHello();
    } else {
      actions.handleQuery(message);
    }
  };

  return (
    <div className="chat-message">
      {React.Children.map(children, (child) => React.cloneElement(child, {
        parse,
        createUserMessage,
        actions,
      }))}
    </div>
  );
};

export default MessageParser;
