import React, { useContext, useEffect, useState } from 'react';
import '../components/Header.css';
import Chatbot from 'react-chatbot-kit';
import {
  Col, Row, Layout, message,
} from 'antd';
import Header from '../components/Header';
// import Footer from '../components/Footer';
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

const { Content } = Layout;
const Jugalbandi = () => {
  const [uuid, setUuid] = useState('');
  const [fileList, setFileList] = useState([]);
  const [dropdownOptions, setdropdownOptions] = useState(uuidDatabase);

  const { data, loading, onLoading } = useContext(CustomContext);
  const [extractedText, setExtractedText] = useState({});

  const onUpdateDropdownOptions = (newOption) => {
    setdropdownOptions((prevOptions) => [...prevOptions, newOption]);
  };

  const onSetUuid = (number) => {
    setUuid(number);

    localStorage.removeItem('uuid');
    localStorage.setItem('uuid', number);
  };
  const onRefresh = () => {
    setUuid('');
    localStorage.removeItem('uuid');
  };

  useEffect(() => {
    const txtContent = {};
    if (data !== []) {
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

  const fileUploadProps = {
    name: 'file',
    multiple: true,
    customRequest: async (e) => {
      const formData = new FormData();
      formData.append('files', e.file);
      

      const result = await Api.uploadFile('https://api.jugalbandi.ai/upload-files', formData);

      if (result instanceof Error) {
        message.error(' file upload failed');
      } else {
        message.success('file uploaded successfully.');
        onSetUuid(result.uuid_number);
        const uploadedFile = { name: e.file.name, status: 'done' };
        setFileList([uploadedFile]);
        onUpdateDropdownOptions({value: result.uuid_number, label: e.file.name});
      }
    },
    beforeUpload: (file) => {
      const uploadingFile = { name: file.name, status: 'uploading' };
      setFileList([...fileList, uploadingFile]);
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    fileList,
  };

  return (
    <Layout>
      <Content style={{ paddingBottom: '100px', backgroundColor: '#eff5f8' }}>
        <Header title="Jugalbandi" />
        <Row className="App-grid">
          <Col className="gutter-row" xs={24} sm={24} md={12} lg={12}>
            <div className="App-leftGrid" style={{ backgroundColor: 'white', padding: '2%', borderRadius: '1%' }}>
              <h2>
                Document Selection
                {' '}
                <span style={{ fontSize: '12px', color: '#bababa' }}> Select or Upload Document</span>
                {' '}
              </h2>
              <SelectBox
                placeholder="Select existing document"
                valueSelected={uuid}
                onUpdateValue={onSetUuid}
                options={dropdownOptions}
                onRefresh={onRefresh}
                isSearchEnabled
                hasClearButton
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
          <Col className="gutter-row chat-bot-col" xs={24} sm={24} md={12} lg={12}>
            <div style={{ margin: '16px 0 ' }}>
              <h2>
                Query and Response
                {' '}
                <span style={{ fontSize: '12px', color: '#bababa' }}> Type your query and view response</span>
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
      {/* <Footer
        footerText="Agami India, Ahuja Palace, Richmond Rd, Langford Gardens,
         Bengaluru, Karnataka 560025, team@agami.in"
      /> */}
    </Layout>
  );
};

export default Jugalbandi;
