import React, { Component } from 'react';
import noImage from './noImage.png'
import './App.css';
//import ReactDOM from 'react-dom';

// textInput must be declared here so the ref callback can refer to it
//let textInput = null;

class App extends Component {
  constructor(props) {
    super(props);
    this.state={rotate:false,translate:false,scale:false,opacity:false }
    this.changeHandler = this.changeHandler.bind(this);
  }
  changeHandler(state) {
    this.setState(state);
  }
  render() {
    return (
      <div className="overall">
        <div className="image">
          <ImageUpload rotate={this.state.rotate}
                        translate={this.state.translate}
                        scale={this.state.scale}
                        opacity={this.state.opacity} />
        </div>
        <div className="editing">
          <Application onChange={this.changeHandler}
                        rotate={this.state.rotate}
                        translate={this.state.translate}
                        scale={this.state.scale}
                        opacity={this.state.opacity} />
        </div>
      </div>
    )
  }
}

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageFile: '',
      imagePreviewUrl: '',
      csvFile: '',
      csvFileName: ''
    };
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleCsvChange = this.handleCsvChange.bind(this);
  }

  handleImageChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        imageFile: file,
        imagePreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(file);
  }

  handleCsvChange(e) {
    e.preventDefault();
    let file = e.target.files[0];
    this.setState({
      csvFile: file,
      csvFileName: file.name
    });
  }

  render() {
    let { imagePreviewUrl, imageFile, csvFileName } = this.state;

    let imagePreview = null;
    if (imagePreviewUrl) {
      imagePreview = (<img src={imagePreviewUrl} alt="" />);
    } else {
      imagePreview = (<div></div>);
    }

    return (
      <div className="previewComponent">
        <div>
          <h1 className="font-bold text-4xl" style={{ color: '#000000' }}>NIGHT TIME ANALYZER</h1>
        </div>
        <div style={{ color: '#000000' }}>A website for analyzing poverty levels in urban areas based on nighttime satellite imagery.</div>
        
        <div className="imgPreview">
          {imagePreview}
        </div>
        
        <div>
          <input id="csvInput" type="file" accept=".csv" onChange={this.handleCsvChange} style={{ display: 'none' }} />
          <button className="choosebutton" onClick={() => document.getElementById('csvInput').click()}>
            Choose CSV
          </button>
          {csvFileName && <p>Selected CSV: {csvFileName}</p>}
        </div>
      </div>
    );
  }
}


class Application extends React.Component {
  constructor(props) {
    super(props);
    // Define a state variable to track whether an image is processed
    this.state = {
      isProcessed: false
    };
    // Bind the reset function to access 'this'
    this.handleReset = this.handleReset.bind(this);
  }

  // Function to handle reset button click
  handleReset() {
    this.setState({ isProcessed: false });
    this.props.onChange({ csvFileName: '' });
    window.location.reload(); // Refresh the page
  }


  render() {
    // Display the PDF logo image only when it is processed
    let processedImage = null;
    if (this.state.isProcessed) {
      processedImage = <img src="sample output.png" alt="Processed PDF Logo" />;
    }
  
    // If image is processed, display the reset button, else display the process button
    let actionButton = this.state.isProcessed ? (
      <button className="resetButton" onClick={this.handleReset}>
        Reset
      </button>
    ) : (
      <button className="processButton" onClick={() => this.setState({ isProcessed: true })}>
        Click here to get the result!
      </button>
    );
  
    return (
      <div className="edit">
        {/* Display the processed image or null */}
        {processedImage}
        {/* Display the action button */}
        <div>
          {actionButton}
        </div>
      </div>
    );
  }
}  
export default App;
