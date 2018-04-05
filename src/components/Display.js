import React, { Component } from 'react';
import axios from 'axios';
import dateformat from 'dateformat';

class Display extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      cans: [],
      searchTerm: ''
    };
  }
  handleSearchTermChange = event => {
    this.setState({ searchTerm: event.target.value });
  };

  getCleanDate = date => dateformat(date, 'mmmm, yyyy, h:MM:ss TT');

  componentDidMount() {
    axios
      .get(`http://localhost:3000/cans`)
      .then(response => {
        const createdDate = response.data.map(can => this.getCleanDate(`${can.createdDate}`));
        const modifiedDate = response.data.map(can => this.getCleanDate(`${can.modifiedDate}`));
        this.setState({
          isLoaded: true,
          cans: {
            data: response.data,
            createdDate: createdDate,
            modifiedDate: modifiedDate
          }
        });
      })
      .catch(error => {
        console.log('Error fetching and parsing data', error);
      });
  }

  render() {
    const { error, isLoaded, searchTerm, cans } = this.state;
    const { data, modifiedDate, createdDate } = this.state.cans;
    console.log(modifiedDate);
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <header>
            <h1>Starlight</h1>
            <input
              onChange={this.handleSearchTermChange}
              value={this.state.searchTerm}
              type="text"
              placeholder="Search"
            />
          </header>
          <section>
            <table className="table">
              <thead className="table-header">
                <tr className="table-header-row">
                  <th>Name:</th>
                  <th>Serial:</th>
                  <th>Size:</th>
                  <th>Created Date:</th>
                  <th>Modified Date:</th>
                  <th>Location Name:</th>
                </tr>
              </thead>
              {cans
                .filter(
                  can =>
                    `${can.name} ${can.data.serial} ${can.data.size} ${can.createdDate} ${can.modifiedDate} ${
                      can.data.location.name
                    } `
                      .toUpperCase()
                      .indexOf(this.state.searchTerm.toUpperCase()) >= 0
                )
                .map((data, index) => (
                  <tbody key={data.serial}>
                    <tr>
                      <td>{data.name}</td>
                      <td>{data.serial}</td>
                      <td>{data.size}</td>
                      <td className="right-align">{createdDate[index]}</td>
                      <td className="right-align">{modifiedDate[index]}</td>
                      <td className="right-align">{data.location.name}</td>
                    </tr>
                  </tbody>
                ))}
            </table>
          </section>
        </div>
      );
    }
  }
}

export default Display;
