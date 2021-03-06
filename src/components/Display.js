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
      searchTerm: '',
      sorted: false
    };
  }

  //handle search term
  handleSearchTermChange = event => {
    this.setState({
      searchTerm: event.target.value
    });
  };

  // sort funtion
  onSort(event, sortKey) {
    const { sorted, cans } = this.state;
    // sort based on on sortKey
    if (!sorted) {
      cans.sort((a, b) => a[sortKey].localeCompare(b[sortKey]));
      this.setState({
        cans
      });
    } else {
      cans.sort((a, b) => b[sortKey].localeCompare(a[sortKey]));
      this.setState({
        cans
      });
    }
    // toggle the previous sort state
    this.setState(prevState => ({
      sorted: !prevState.sorted
    }));
  }

  // clean date function
  getCleanDate = date => dateformat(date, 'mmmm, yyyy, h:MM:ss TT');

  componentDidMount() {
    axios
      .get(`http://localhost:3004/cans`)
      .then(response => {
        // make a copy of the response
        const data = response.data.map(map => map);
        // clean createdDate and modifiedDate
        data.forEach(can => (can.createdDate = this.getCleanDate(`${can.createdDate}`)));
        data.forEach(can => (can.modifiedDate = this.getCleanDate(`${can.modifiedDate}`)));
        // set cleaned respose to state
        this.setState({
          isLoaded: true,
          cans: data
        });
      })
      .catch(error => {
        console.log('Error fetching and parsing data', error);
      });
  }

  render() {
    const { error, isLoaded, searchTerm, cans } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <header>
            <h1>Starlight</h1>
            <input onChange={this.handleSearchTermChange} value={searchTerm} type="text" placeholder="Search" />
          </header>
          <section>
            <table className="table">
              <thead className="table-header">
                <tr className="table-header-row">
                  <th className="pointer" onClick={event => this.onSort(event, 'name')}>
                    Name:
                  </th>
                  <th className="pointer" onClick={event => this.onSort(event, 'serial')}>
                    Serial:
                  </th>
                  <th className="pointer" onClick={event => this.onSort(event, 'size')}>
                    Size:
                  </th>
                  <th>Created Date:</th>
                  <th>Modified Date:</th>
                  <th>Location Name:</th>
                </tr>
              </thead>
              {cans
                .filter(
                  can =>
                    // create string for which to search within
                    `${can.name} ${can.serial} ${can.size} ${can.createdDate} ${can.modifiedDate} ${can.location.name} `
                      // make case-insensitive
                      .toUpperCase()
                      // define filter parameteres
                      .indexOf(this.state.searchTerm.toUpperCase()) >= 0
                )
                .map(can => (
                  <tbody key={can.serial}>
                    <tr>
                      <td>{can.name}</td>
                      <td>{can.serial}</td>
                      <td>{can.size}</td>
                      <td className="right-align">{can.createdDate}</td>
                      <td className="right-align">{can.modifiedDate}</td>
                      <td className="right-align">{can.location.name}</td>
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
