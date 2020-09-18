import React, { Component } from 'react';
//import Async from 'react-async';
import logo from './logo.svg';
import './App.css';
import Amplify, { Storage } from 'aws-amplify';
import ReactDOM from 'react-dom';
//import { StyleSheet, ActivityIndicator, View } from 'react-native';
//import Spinner from 'react-native-loading-spinner-overlay';
//import awsconfig from './aws-exports';
//Amplify.configure(awsconfig);
 
 
Amplify.configure({
    Auth: {
        identityPoolId: 'us-east-1:2494fd80-9a3b-419e-b689-049db34eb789', //REQUIRED - Amazon Cognito Identity Pool ID
        region: 'us-east-1', // REQUIRED - Amazon Cognito Region
       // userPoolId: 'XX-XXXX-X_abcd1234', //OPTIONAL - Amazon Cognito User Pool ID
        //userPoolWebClientId: 'XX-XXXX-X_abcd1234', //OPTIONAL - Amazon Cognito Web Client ID
    },
    Storage: {
        AWSS3: {
            bucket: 'videobucketsprabha', //REQUIRED -  Amazon S3 bucket name
            region: 'us-east-1', //OPTIONAL -  Amazon service region
        }
    }
});
class App extends Component {

   constructor(props) {
        super(props);
    this.state = { visible: false };
    this.filehandle = null;
    this.file = null;
   //  this.promise1 = this.promise1.bind(this);
    // this.promise2 = this.promise2.bind(this);
     
   }
  
  promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 5000, 'one');
});

promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'two');
});

  Choose_video_file = async () => {
    this.fileHandle = await window.chooseFileSystemEntries();
    this.file = await this.fileHandle.getFile();
    alert("filename is"+this.file.name)
  }
 
  Store_S3 = async () => {
    
  //      return new Promise((resolve, reject) => {
       let promise = new Promise((resolve, reject) => {
         var filename = 'test2vvv.txt';
          var file_content = 'conent for test2';
    resolve(Storage.put(filename, file_content, {
        level: 'private',
        contentType: 'text/plain'
    }));
  });
    promise.then(
  result =>{ alert("Uploaded. Wait for censoring"); this.setState({ visible: true });
  Promise.race([this.promise1, this.promise2]).then((value) => {
  alert("value is"+value);});
  return}, // doesn't run
  error => { alert("upload failed");this.setState({ visible: false }); return} // shows "Error: Whoops!" after 1 second
);
  }
   
  /*function Store_S3(filename,content){
    return new Promise((resolve, reject) => {
    resolve(Storage.put(filename, content, {
        level: 'private',
        contentType: 'text/plain'
    }));
  });
  
}
*/
 // listQuery = async () => {
  //  const msg = await Store_S3('test1.txt','content cfor the file test1.txt');
  //}
   

 
    render() {
    return (
      <div className="App">
        
        <p> Click a button </p>
        {this.state.visible ? (
        <img src={logo} className="App-logo" alt="logo" />
         
  ) : null}
        <button id="choose_file" onClick={this.Choose_video_file}>Choose Video File</button>
        <button onClick={this.Store_S3}>Upload to  S3</button>
         
      </div>
    );
  }
  
}

/*
async function App() {
  try {
    //const msg = await Store_S3('test1.txt','content cfor the file test1.txt');
      return (
         
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
          
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          uploaded
        </a>
        <h1>Hello from Prabha - uploaded</h1>
      </header>
    </div>
  );
  } catch(err) {
      return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
          
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          upload failed
        </a>
        <h1>Hello from Prabha - upload failed</h1>
      </header>
    </div>
  );
  }
}
*/
 

export default App;
