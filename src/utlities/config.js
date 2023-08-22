import { createChatBotMessage } from 'react-chatbot-kit';
import React from 'react';
import FeedbackButtons from '../components/FeedbackButtons';
import BotAvatar from '../components/BotAvatar';

const config = {
  botName: 'Jugalbandi',
  initialMessages: [createChatBotMessage('Hello, ask me a question')],
  BOT_AVATAR_PATH: '',
  customComponents: {
    botAvatar: (props) => <BotAvatar props={props} />,
  },
  widgets: [
    {
      widgetName: 'FeedbackButtons',
      widgetFunc: () => <FeedbackButtons />,
    },
  ],
};

export default config;
