import React from 'react';
import './App.css';
import { CustomContextProvider } from './utlities/CustomContext';
import Jugalbandi from './screens/Jugalbandi';

const App = () => (
  <CustomContextProvider>
    <Jugalbandi />
  </CustomContextProvider>
);

export default App;
