import React, { Component } from 'react';
//import Async from 'react-async';
import logo from './logo.svg';
import censr from './img_censr.jpg';
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
        
    this.state = { visible: false, file:null, time_array:null, vid_width:"640", vid_muted : false, img_width : "0", vid_url:null };
    this.filehandle = null;
    this.file = null;
    this.onChange = this.onChange.bind(this);
    this.ontimeupdate = this.ontimeupdate.bind(this);
    //this.add2MtssDelay = this.add2MtssDelay.bind(this);
     
   }
  
 
  onChange(e) {
    this.setState({file:e.target.files[0]});
     this.setState({vid_url:window.URL.createObjectURL(e.target.files[0])});
    this.file = this.state.file;
  }
  
  		ontimeupdate(e) {
			// Display the current position of the video in a p element with id="demo"
			//alert("ontimeupdate");
			
			this.setState({ vid_width: "640", img_width: "0", vid_muted : false });
			let show_video = true;
        if (this.state.time_array != null){
 
		//	if (no_censor_value == false) {
				for (var i = 0; i < parseInt(this.state.time_array.length); i++) {

					if ((e.target.currentTime > parseFloat(this.state.time_array[i].start))
							&& (e.target.currentTime < parseFloat(this.state.time_array[i].end))) {
					 show_video = false;
				
						 

						break;
					}

				}
  		}
  	show_video ? this.setState({ vid_width: "640",  img_width: "0", vid_muted : false }): this.setState({ vid_width: "0", img_width: "128" , vid_muted : true});
  		
		//	}

 
 
		}
  
 
   wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
 retrieveTC_json(){
   
 Storage.get('CV_TimeInterval.json', { download: true })
    .then(result => {
      result.Body.text().then(string => { 
        //alert(string)
        let contents = JSON.parse(string);
        this.state.time_array = contents['list'];
        
        this.setState({ vid_width: "640", img_width: "0", vid_muted : false });
        
      });
 this.setState({ visible: false }); 
})
    .catch(err => 
    {
    //json file is not ready. wait for 2 minute
    
    this.wait(120000).then(() => { 
      alert("try to download after 2 mts now");
      Storage.get('CV_TimeInterval.json', { download: true })
    .then(result => {
      result.Body.text().then(string => { 
        //alert(string)
        let contents = JSON.parse(string);
        this.state.time_array = contents['list'];
        
        this.setState({ vid_width: "640", img_width: "0", vid_muted : false });
        
      }); this.setState({ visible: false }); 
 
})}).catch(err => {console.log(err)});
    this.setState({ vid_width: "0", img_width: "128", vid_muted : true, visible: false }); 
    console.log(err);
    });
 
 }
 
  Store_S3 = async () => {
    /*  
  let promise1 = new Promise((resolve, reject) => {
 // setTimeout(resolve, 5000, 'one');
 const id = setTimeout(() => {
    alert("8000");
    clearTimeout(id);
    resolve('timeout!');
  }, 8000);
});

let promise2 = new Promise((resolve, reject) => {
  const id2 = setTimeout(() => {
    alert("4000");
    clearTimeout(id2);
    
    resolve('response!');
  }, 4000);
 // setTimeout(resolve, 4000, 'two');
});
*/
  //      return new Promise((resolve, reject) => {
  this.setState({ visible: true });
       let promise = new Promise((resolve, reject) => {
         var filename = this.state.file.name;
          //var file_content = 'conent for test2';
           var file_content = this.state.file;
    resolve(Storage.put(filename, file_content, {
        level: 'private',
        contentType: file_content.type
    }));
  });
    promise.then(
  result =>{ alert("Uploaded. Wait for censoring"); this.retrieveTC_json();   
  //get the time code json from S3
  
/*
  let race = Promise.race([
  promise1, promise2
])
race.then((res) => alert(res)) // -> Promise A win!
*/
//  Promise.race([this.promise1, this.promise2]).then((value) => {
 //  alert("value is"+value);});
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
        
        
        {this.state.visible ? (
        <img src={logo} className="App-logo" alt="logo" />
         
  ) : null}
        <p>
        <input type="file" onChange={this.onChange} />
        <button onClick={this.Store_S3}>Censor the Video(Upload to  S3)</button>
        </p>
        <p>
        <img src={censr} alt="censor" width={this.state.img_width} height="70" />
        </p>
        <p>        
        <video id="vid"   src={ this.state.vid_url} onTimeUpdate={this.ontimeupdate}  width={this.state.vid_width} muted={this.state.vid_muted} height="352" controls/>
        </p>
        
         
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
