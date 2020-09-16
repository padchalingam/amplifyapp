import React from 'react';
import logo from './logo.svg';
import './App.css';
import Amplify, { Storage } from 'aws-amplify';
import ReactDOM from 'react-dom';
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
function App() {
  var result1;
  var err1;
  var upload;
    try{
    upload = Storage.put('test.txt', 'Private Content', {
        level: 'private',
        contentType: 'text/plain'
    })
    .then (result => {result1 = result})
    .catch(err => {err1 = err});
} catch (e) {
    err1 = e.message;
  }
    var promise = upload.promise();

  promise.then(
    function(data) {
      result1 = "Successfully uploaded video.";
      
     // viewS3(albumName);
    },
    function(err) {
      return err1 = err;
    }
  );
    
class S3_Log extends React.Component {
  render() {
    return <h2>Err is {this.props.err} and Result is {this.props.result}!</h2>;
  }
}
 

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
         <S3_Log err={err1} result={result1} />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Reactddd
        </a>
        <h1>Hello from Prabha</h1>
      </header>
    </div>
  );
}

export default App;
