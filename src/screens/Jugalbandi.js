import React, { useContext, useEffect, useState } from 'react';
import '../components/Header.css';
import Chatbot from 'react-chatbot-kit';
import {
  Col, Row, Layout, message,
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
import SelectBox from '../components/UuidSelect';
import FileUpload from '../components/FileUpload';

const WARNING_MESSAGE = 'Please select a document from the dropdown or upload a new file.';
const { Content } = Layout;
const Jugalbandi = () => {
  const [selectedOption, setSelectOption] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [dropdownOptions, setdropdownOptions] = useState(uuidDatabase);
  const [extractedText, setExtractedText] = useState({});

  const {
    data, loading, onLoading, updateData,
  } = useContext(CustomContext);

  const disableAskButton = () => {
    const askButton = document.querySelector(
      '.react-chatbot-kit-chat-btn-send',
    );
    askButton.disabled = true;
    askButton.style.opacity = 0.5;
    askButton.setAttribute('title', WARNING_MESSAGE);
  };

  const createInfoMessage = () => {
    const infoMessage = document.createElement('div');
    infoMessage.setAttribute('id', 'chat-input-info-msg');
    infoMessage.innerText = WARNING_MESSAGE;
    return infoMessage;
  };

  const showInfoMessage = () => {
    if (!document.querySelector('#chat-input-info-msg')) {
      const inputParent = document.querySelector(
        '.react-chatbot-kit-chat-input-container',
      );
      inputParent?.append(createInfoMessage());
    }
  };

  const onUpdateDropdownOptions = (newOption) => {
    setdropdownOptions((prevOptions) => [...prevOptions, newOption]);
  };

  const onSetUuid = (number) => {
    localStorage.removeItem('uuid');
    localStorage.setItem('uuid', number);
  };

  const enableAskButtonAndRemoveMsg = () => {
    const askButton = document.querySelector(
      '.react-chatbot-kit-chat-btn-send',
    );
    askButton.disabled = false;
    askButton.style.opacity = 1;
    askButton.setAttribute('title', '');
    document.querySelector('#chat-input-info-msg')?.remove();
  };

  const getPreview = async (uid, name) => {
    onLoading(true);
    try {
      const file = await fetch(
        `https://jugalbandi-temp-dev-genericqa-fer6v2lowq-uc.a.run.app/public-text-url?uuid_number=${uid}`,
      );
      const link = await file.json();
      const previewContent = await fetch(link[0]);
      const content = await previewContent.text();
      // eslint-disable-next-line max-len
      updateData([
        { chunks: [], source_text_link: link[0], source_text_name: name },
      ]);
      setExtractedText({ [name]: content });
      onLoading(false);
    } catch (e) {
      onLoading(false);
    }
  };

  const onSelectDropdownFile = (uid) => {
    setFileList([]);
    onSetUuid(uid);
    setSelectOption(uid);
    if (uid) {
      enableAskButtonAndRemoveMsg();
      const dropdownOption = dropdownOptions.find(
        (option) => option.value === uid,
      );
      getPreview(uid, dropdownOption?.label);
    }
  };

  const fileUploadProps = {
    name: 'file',
    multiple: false,
    accept: '.pdf, .doc, .docx, .txt',
    customRequest: async (e) => {
      const formData = new FormData();
      formData.append('files', e.file);

      const result = await Api.uploadFile(
        'https://api.jugalbandi.ai/upload-files',
        formData,
      );

      if (result instanceof Error) {
        message.error('File upload failed');
      } else {
        message.success('File uploaded successfully.');
        onSetUuid(result.uuid_number);
        setSelectOption(null);
        const uploadedFile = { name: e.file.name, status: 'done' };
        setFileList([uploadedFile]);
        enableAskButtonAndRemoveMsg();
        // eslint-disable-next-line max-len
        onUpdateDropdownOptions({
          value: result.uuid_number,
          label: e.file.name,
        });
        getPreview(result.uuid_number, e.file.name);
      }
    },
    beforeUpload: (file) => {
      const uploadingFile = { name: file.name, status: 'uploading' };
      setFileList([uploadingFile]);
    },
    fileList,
  };

  useEffect(() => {
    const txtContent = {};
    if (data?.length) {
      Promise.all(
        data.map((dataSource) => Api.readPdf(dataSource.source_text_link).then((response) => ({
          dataSource,
          extractedTextResponse: response,
        }))),
      ).then((results) => {
        results.forEach((result) => {
          const { dataSource, extractedTextResponse } = result;
          txtContent[dataSource.source_text_name] = extractedTextResponse;
        });
        setExtractedText(txtContent);
        onLoading(false);
      });
    }
  }, [data]);

  useEffect(() => {
    setTimeout(() => {
      const highligtedSpan = document.querySelector(
        '.previewTab .ant-tabs-content span:first-child',
      );
      const { top: spanTop } = highligtedSpan?.getBoundingClientRect() || {};
      const previewContainer = document.querySelector('#preview-container');
      const { top: containerTop } = previewContainer?.getBoundingClientRect() || {};
      previewContainer?.scrollBy({
        top: spanTop - containerTop,
        behavior: 'smooth',
      });
    }, 1000);
  }, [extractedText]);

  useEffect(() => {
    disableAskButton();
    showInfoMessage();

    return () => localStorage.removeItem('uuid');
  }, []);

  return (
    <Layout>
      <Content style={{ paddingBottom: '100px', backgroundColor: '#F0F2F5' }}>
        <Header title="Jugalbandi" subTitle="A Thoughtworks Initiative" />
        <Row className="App-grid">
          <Col className="gutter-row" xs={24} sm={24} md={12} lg={12}>
            <div
              className="App-leftGrid"
              style={{
                backgroundColor: 'white',
                padding: '28px',
                paddingTop: '18px',
                borderRadius: '1%',
              }}
            >
              <h2 className="section-title">
                Document Selection
                {' '}
                <span className="section-sub-title">
                  {' '}
                  Select or Upload Document
                </span>
                {' '}
              </h2>
              <SelectBox
                className="doc-selection-input"
                valueSelected={selectedOption}
                onUpdateValue={onSelectDropdownFile}
                options={dropdownOptions}
              />
              <p style={{ textAlign: 'center' }}>OR</p>
              <FileUpload fileUploadProps={fileUploadProps} />
            </div>
            <div className="App-rightGrid" style={{ marginTop: '2%' }}>
              {loading ? (
                <Loader />
              ) : (
                <DocumentTabs docList={data} docContent={extractedText} />
              )}
            </div>
          </Col>
          <Col
            className="gutter-row chat-bot-col"
            xs={24}
            sm={24}
            md={12}
            lg={12}
          >
            <div className="chat-bot-header-container">
              <h2 className="section-title">
                Query and Response
                {' '}
                <span className="section-sub-title">
                  {' '}
                  Type your query and view response
                </span>
                {' '}
              </h2>
            </div>
            <Chatbot
              className="chatbot-container"
              config={config}
              messageParser={MessageParser}
              actionProvider={ActionProvider}
              placeholderText="Type your question"
              headerText={<> </>}
              disableScrollToBottom={false}
            />
          </Col>
        </Row>
      </Content>
      <Footer
        footerText="Agami India, Ahuja Palace, Richmond Rd, Langford Gardens,
         Bengaluru, Karnataka 560025, team@agami.in"
      />
      {/* , Ahuja Palace, Richmond Rd, Langford Gardens,
      Bengaluru, Karnataka 560025, team@agami.in" */}
    </Layout>
  );
};

export default Jugalbandi;
