import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      csvFile: null,
      mapImage: null
    };
    this.handleCsvChange = this.handleCsvChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleCsvChange(event) {
    this.setState({
      csvFile: event.target.files[0]
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('csv_file', this.state.csvFile);

    fetch('/generate_map', {
      method: 'POST',
      body: formData
    })
    .then(response => response.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      this.setState({
        mapImage: url
      });
    })
    .catch(error => console.error('Error:', error));
  }

  render() {
    return (
      <div className="App">
        <h1>Night Time Analyzer</h1>
        <form onSubmit={this.handleSubmit}>
          <input type="file" accept=".csv" onChange={this.handleCsvChange} />
          <button type="submit">Generate Map</button>
        </form>
        {this.state.mapImage && <img src={this.state.mapImage} alt="Map" />}
      </div>
    );
  }
}

export default App;
