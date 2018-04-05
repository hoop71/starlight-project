import React, { Component } from 'react';
import axios from 'axios';

class Display extends Component {
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
      return (
        <table className="table">
          <thead className="table-header">
            <tr className="table-header-row">
              <th>Can ID:</th>
              <th>Location:</th>
              <th>Size:</th>
            </tr>
          </thead>
          {cans.map(can => (
            <tbody key={can.id} className="center">
              <tr>
                <td>{can.id}</td>
                <td>{can.location.name}</td>
                <td>{can.size}</td>{' '}
              </tr>
            </tbody>
          ))}
        </table>
      );
    }
  }
}

export default Display;
