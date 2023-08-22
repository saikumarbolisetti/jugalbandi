import React, {
  useContext, useEffect, useState,
} from 'react';
import '../components/Header.css';
import Chatbot from 'react-chatbot-kit';
import {
  Col, Row,
  Layout,
} from 'antd';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../App.css';
import config from '../utlities/config';
import MessageParser from '../utlities/MessageParser';
import ActionProvider from '../utlities/ActionProvider';
import { CustomContext } from '../utlities/CustomContext';
import DocumentTabs from '../components/DocumentTabs';
import Loader from '../components/Loader';
import Api from '../API/Api';
import uuidDatabase from '../UuidDatabase';
import UuidInput from '../components/UuidInput';
import SelectBox from '../components/UuidSelect';

const { Content } = Layout;
const Jugalbandi = () => {
  const [uuidOptionSelected, setUuidOptionSelected] = useState('');
  const [uuid, setUuid] = useState('');
  const uuidOptions = [
    {
      value: 'input',
      label: 'Input New UUID Number',
    },
    {
      value: 'select',
      label: 'Select Existing UUID Number',
    },
  ];
  const [disabled, setDisabled] = useState(true);
  const { data, loading, onLoading } = useContext(CustomContext);
  const [extractedText, setExtractedText] = useState({});
  const onSetUuid = (number) => {
    setUuid(number);
    setDisabled(false);
    localStorage.removeItem('uuid');
    localStorage.setItem('uuid', number);
  };
  const onRefresh = () => {
    setUuid('');
    localStorage.removeItem('uuid');
    setDisabled(true);
  };
  const onSetUuidOptionSelected = (uuidOption) => {
    setUuidOptionSelected(uuidOption);
    onRefresh();
  };
  useEffect(() => {
    const txtContent = {};
    if (data !== []) {
      Promise.all(data.map((dataSource) => Api.readPdf(dataSource.source_text_link)
        .then((response) => ({ dataSource, extractedTextResponse: response }))))
        .then((results) => {
          results.forEach((result) => {
            const { dataSource, extractedTextResponse } = result;
            txtContent[dataSource.source_text_name] = extractedTextResponse;
          });
          setExtractedText(txtContent);
          onLoading(false);
        });
    }
  }, [data]);
  return (
    <Layout>
      <Content style={{ paddingBottom: '100px', backgroundColor: 'white' }}>
        <Header title="Jugalbandi" />

        <Row className="App-grid">
          <Col className="gutter-row" xs={24} sm={24} md={12} lg={12}>
            <div className="App-leftGrid">
              {' '}
              <SelectBox
                label=""
                placeholder="Select the method you want to give UUID number"
                valueSelected={uuidOptionSelected}
                onUpdateValue={onSetUuidOptionSelected}
                options={uuidOptions}
                isSearchEnabled={false}
                hasClearButton={false}
              />
              {uuidOptionSelected === '' ? null : (
                <div style={{ marginTop: '2%' }}>
                  {uuidOptionSelected === 'input' ? (
                    <UuidInput
                      uuid={uuid}
                      onSetUuid={onSetUuid}
                      onRefresh={onRefresh}
                      disabled={disabled}
                    />
                  ) : (
                    <SelectBox
                      label="Uuid Number"
                      placeholder="Enter The Name of The Document You Want to Query"
                      valueSelected={uuid}
                      onUpdateValue={onSetUuid}
                      options={uuidDatabase}
                      onRefresh={onRefresh}
                      isSearchEnabled
                      hasClearButton
                    />
                  )}
                </div>
              )}
              <Chatbot
                className="chatbot-container"
                config={config}
                messageParser={MessageParser}
                actionProvider={ActionProvider}
                placeholderText="Type your question"
                headerText={<> </>}
                disableScrollToBottom={false}
              />
            </div>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={12} lg={12}>
            <div className="App-rightGrid">
              {loading ? (
                <Loader />
              )
                : <DocumentTabs docList={data} docContent={extractedText} />}
            </div>
          </Col>
        </Row>
      </Content>
      <Footer footerText="Agami India, Ahuja Palace, Richmond Rd,
        Langford Gardens, Bengaluru, Karnataka 560025, team@agami.in"
      />

    </Layout>
  );
};

export default Jugalbandi;
