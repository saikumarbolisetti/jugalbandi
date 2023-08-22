/* eslint-disable camelcase */
import React, { useContext } from 'react';
import { CustomContext } from './CustomContext';
import Chatbot from './Chatbot';

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const { updateData, onLoading, updateQueryAnswer } = useContext(CustomContext);

  const handleBotMessages = (chatBotMessage) => {
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, chatBotMessage],
    }));
  };

  const handleFeedback = () => {
    const botMessage = createChatBotMessage(
      'Thank you, your response has been recorded',
    );
    handleBotMessages(botMessage);
  };

  const handleHello = () => {
    const botMessage = createChatBotMessage('Hello. Nice to meet you.');
    handleBotMessages(botMessage);
  };

  const handleQuery = async (query_string) => {
    onLoading(true);
    const uuid = localStorage.getItem('uuid');
    const loadingMessage = createChatBotMessage("I'll see what I can find", {
      withAvatar: true,
      delay: 100,
    });
    handleBotMessages(loadingMessage);
    const chatbotResponse = await Chatbot.getChatbotResponse(uuid, query_string);
    if (chatbotResponse.source_text) {
      updateData(chatbotResponse.source_text);
    } else {
      updateData([]);
    }
    let botMessage;
    if (chatbotResponse.answer) {
      updateQueryAnswer({
        query: chatbotResponse.query,
        response: chatbotResponse.answer,
      });
      botMessage = createChatBotMessage(chatbotResponse.answer, {
        withAvatar: true,
        widget: 'FeedbackButtons',
      });
    } else {
      updateQueryAnswer({});
      botMessage = createChatBotMessage(chatbotResponse.detail, {
        withAvatar: true,
      });
    }
    handleBotMessages(botMessage);
  };

  return (
    <div>
      {React.Children.map(children, (child) => React.cloneElement(child, {
        actions: {
          handleHello,
          handleQuery,
          handleFeedback,
          handleBotMessages,
        },
      }))}
    </div>
  );
};

export default ActionProvider;
