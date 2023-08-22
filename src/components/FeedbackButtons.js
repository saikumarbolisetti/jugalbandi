import {
  DislikeFilled, LikeFilled,
} from '@ant-design/icons';
import { Button } from 'antd';
import React, { useContext, useState } from 'react';
import { CustomContext } from '../utlities/CustomContext';
import Chatbot from '../utlities/Chatbot';

const LikeDislikeButton = ({
  isLiked, isDisliked, onLiked, onDisLiked,
}) => (
  <>
    {isLiked ? <Button type="text" shape="circle" icon={<LikeFilled style={{ color: '#754a76' }} />} onClick={onLiked} disabled={!isDisliked} />
      : <Button type="text" shape="circle" icon={<LikeFilled style={{ color: '#ecc0ed' }} />} onClick={onLiked} disabled={!isDisliked} />}
    {!isDisliked ? <Button type="text" shape="circle" icon={<DislikeFilled style={{ color: '#754a76' }} />} onClick={onDisLiked} disabled={isLiked} />
      : <Button type="text" shape="circle" icon={<DislikeFilled style={{ color: '#ecc0ed' }} />} onClick={onDisLiked} disabled={isLiked} />}
  </>
);
const FeedbackButtons = () => {
  const { queryAnswer } = useContext(CustomContext);
  const uuid = localStorage.getItem('uuid');
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(true);
  const [message, setMessage] = useState('');
  const onUpdateFeedbackMessage = (feedbackResponse) => {
    if (feedbackResponse) {
      setMessage('Thank you for your feedback!');
    }
  };
  const onLiked = async () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      const feedbackStatus = await Chatbot.sendFeedback(!isLiked, queryAnswer, uuid);
      onUpdateFeedbackMessage(feedbackStatus);
    }
  };
  const onDisLiked = async () => {
    setIsDisliked(!isDisliked);
    if (isDisliked) {
      const feedbackStatus = await Chatbot.sendFeedback(!isDisliked, queryAnswer, uuid);
      onUpdateFeedbackMessage(feedbackStatus);
    }
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      {message !== '' ? <div style={{ marginLeft: '10px', marginTop: '5px', color: '#754a76' }}>{message}</div> : <LikeDislikeButton isLiked={isLiked} isDisliked={isDisliked} onLiked={onLiked} onDisLiked={onDisLiked} />}

    </div>
  );
};

export default FeedbackButtons;
