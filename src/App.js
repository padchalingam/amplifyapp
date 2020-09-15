import React from 'react';
import logo from './logo.svg';
import './App.css';
import Amplify, { Storage } from 'aws-amplify';
import ReactDOM from 'react-dom';
//import awsconfig from './aws-exports';
//Amplify.configure(awsconfig);
Amplify.configure({
    Auth: {
        identityPoolId: 'us-east-1:2ea6f0d8-fe33-43d4-8f45-445572915f1c', //REQUIRED - Amazon Cognito Identity Pool ID
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
      Storage.put('test.txt', 'Hello')
    .then (result => {result1=result;console.log(result)}) // {key: "test.txt"}
    .catch(err => {err1=err;console.log(err)});
    
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
