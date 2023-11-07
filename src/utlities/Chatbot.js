import Api from '../API/Api';

/* eslint-disable camelcase */
const getChatbotResponse = async (uuid_number, query_string) => {
  const url = 'https://jugalbandi-genericqa-wjevjjioua-uc.a.run.app/query-with-langchain-gpt3-5';
  const params = {
    uuid_number,
    query_string,
  };
  const response = await Api.get(url, params);
  return response;
};
const sendFeedback = async (feedback, queryAnswer, uuid_number) => {
  const url = 'https://jugalbandi-genericqa-wjevjjioua-uc.a.run.app/response-feedback';
  const response = await Api.post(url, {
    uuid_number,
    query: queryAnswer.query,
    response: queryAnswer.response,
    feedback,
  });
  return response;
};

export default { getChatbotResponse, sendFeedback };
