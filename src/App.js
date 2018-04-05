import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      cans: []
    };
  }

  componentDidMount() {
    axios
      .get(`http://localhost:3000/cans`)
      .then(response => {
        console.log(response);
        this.setState({
          isLoaded: true,
          cans: response.data
        });
      })
      .catch(error => {
        console.log('Error fetching and parsing data', error);
      });
  }

  render() {
    const { error, isLoaded, cans } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return <ul>{cans.map(can => <li>{can.id}</li>)}</ul>;
    }
  }
}

export default App;
