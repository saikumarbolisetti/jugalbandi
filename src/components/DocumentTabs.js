import React from 'react';
import { Tabs } from 'antd';
import Content from './Content';

const DocumentTabs = ({ docList, docContent }) => (
  <div style={{
    minHeight: '700px', maxHeight: '700px', overflowY: 'scroll', backgroundColor: 'white', padding: '5% 5% 2% 5%', borderRadius: '1%'
  }}
  >
    <h2> Preview <span style={{fontSize: '14px', color: '#bababa'}}> View selected document</span> </h2>
    {docList.length > 0 && (
      <Tabs
        style={{
          backgroundColor: 'white', borderRadius: '10px', padding: '3%',
        }}
        type="card"
        items={docList.map((_, i) => {
          const id = String(i + 1);
          return {
            label: _.source_text_name,
            key: id,
            children: <Content
              content={docContent[_.source_text_name]}
              highlightedPortions={_.chunks}
            />,
          };
        })}
      />
    )}
  </div>
);

export default DocumentTabs;
