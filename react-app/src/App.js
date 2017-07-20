import React, { Component } from 'react';
import logo from './logo.svg';
import './Styles/App.css';

import Header from './Components/Header.js';
import TimeSeries from './Components/TimeSeries.js';
import Footer from './Components/Footer.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <TimeSeries />
        <Footer />
      </div>
    )
  }
}

export default App;
