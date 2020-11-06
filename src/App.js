import React, { Component } from 'react';
//import Async from 'react-async';
import logo from './logo.svg';
import loading from './loading.gif';
import censr from './img_censr.jpg';
import './App.css';
//import Amplify,  { Storage} from 'aws-amplify';
//import API, { graphqlOperation } from '@aws-amplify/api';
import Amplify, { API, graphqlOperation, Storage } from 'aws-amplify';

//import VideoLength from 'video-length';

import ReactDOM from 'react-dom';

//Import {getVideoDurationInSeconds} from 'get-video-duration';
//import axios from 'axios';
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
    },
    API: {
        endpoints: [{
            name: "getVideoDuration-API",
            //https://hlbyevd8yd.execute-api.us-east-1.amazonaws.com/dev/getvideoduration-api
            endpoint: "https://hlbyevd8yd.execute-api.us-east-1.amazonaws.com/dev"
        }]
    }
});

//const { getVideoDurationInSeconds } = require('get-video-duration');
//const  VideoLength = require('video-length');

class App extends Component {

    constructor(props) {
        super(props);
        // https://ibt4xj7apf.execute-api.us-east-1.amazonaws.com/default/getVideoDuration
        this.state = {
            duration: "0",
            visible: false,
            file: null,
            time_array: null,
            vid_width: "640",
            vid_muted: false,
            img_width: "0",
            vid_url: null,
            file_chosen: false,
            getVideoDurationAPI: 'getVideoDuration-API',
            name: '',
            message: '',
            getVideoDurationAPI_PATH: '/getvideoduration-api',
            video_bucket: "",
            video_key: "",
            API_Headers_Body: { // OPTIONAL
                body: { video_bucket: 's3_video_bucket', video_key: 'test.mp4', duration: '0' }, // OPTIONAL
                response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
                queryStringParameters: { // OPTIONAL
                    name: 'param',
                },
            }
        };
        this.filehandle = null;
        this.file = null;
        this.onChange = this.onChange.bind(this);
        this.ontimeupdate = this.ontimeupdate.bind(this);
        //this.add2MtssDelay = this.add2MtssDelay.bind(this);

    }

    change_API_Headers_Body(file) {
        this.setState({
            API_Headers_Body: { // OPTIONAL
                body: { video_bucket: 's3_video_bucket', video_key: file.name, duration: '0' }, // OPTIONAL
                response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
                queryStringParameters: { // OPTIONAL
                    name: 'param',
                },
            }
        });
        return this;
    }

    get_chosen_file(e) {
        this.setState({ file: e.target.files[0] });
        return this;
    }
    async get_chosen_file_and_change_API_Headers_Body(e) {
        try {
            await this.get_chosen_file(e);
            if (this.state.file) {
                await this.change_API_Headers_Body(this.state.file);

            }
        }
        catch (err) { alert(err) }

    }

    async submit_video(e) {
        try {
            
            if (this.state.file) {
            var filename = this.state.file.name;
            var file_content = this.state.file;
                //upload video to S3
                await Storage.put(filename, file_content, {
                    // level: 'private',
                    contentType: file_content.type
                });
                //estimate video duration
                await API.post(this.state.getVideoDurationAPI, this.state.getVideoDurationAPI_PATH, this.state.API_Headers_Body)
                    .then(response => {
                        // Add your code here
                        alert("API invoked" + response.data);
                        this.setState({ duration: response.data });
                    })
                    .catch(error => {
                        //console.log(error.response);
                        alert("API invoke failed");
                    });
            }
        }
        catch (err) { alert(err) }

    }


    onChange(e) {

        this.get_chosen_file_and_change_API_Headers_Body(e);

        this.setState({ vid_url: window.URL.createObjectURL(e.target.files[0]) });



        this.file = this.state.file;



        this.setState({ time_array: null, visible: false, vid_width: "0", img_width: "128", vid_muted: true, file_chosen: true });
    }

    ontimeupdate(e) {
        // Display the current position of the video in a p element with id="demo"
        //alert("ontimeupdate");
        //	 alert("video duration:"+this.state.duration);
        this.setState({ vid_width: "640", img_width: "0", vid_muted: false });
        let show_video = true;
        if (this.state.time_array != null) {

            //	if (no_censor_value == false) {
            for (var i = 0; i < parseInt(this.state.time_array.length); i++) {

                if ((e.target.currentTime > parseFloat(this.state.time_array[i].start)) &&
                    (e.target.currentTime < parseFloat(this.state.time_array[i].end))) {
                    show_video = false;



                    break;
                }

            }
        }
        else { show_video = false; }
        show_video ? this.setState({ vid_width: "640", img_width: "0", vid_muted: false }) : this.setState({ vid_width: "0", img_width: "128", vid_muted: true });

        //	}



    }


    wait = (timeout) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }
    retrieveTC_json() {

        Storage.get('CV_TimeInterval.json', { download: true })
            .then(result => {
                result.Body.text().then(string => {
                    //alert(string)
                    let contents = JSON.parse(string);
                    this.state.time_array = contents['list'];

                    this.setState({ vid_width: "640", img_width: "0", vid_muted: false });

                });
                this.setState({ visible: false });
            })
            .catch(err => {
                //json file is not ready. wait for 2 minute
                alert("try to download after 2 mts now");
                this.wait(120000).then(() => {

                    Storage.get('CV_TimeInterval.json', { download: true })
                        .then(result => {
                            result.Body.text().then(string => {
                                //alert(string)
                                let contents = JSON.parse(string);
                                this.state.time_array = contents['list'];

                                this.setState({ vid_width: "640", img_width: "0", vid_muted: false });

                            });
                            this.setState({ visible: false });

                        })
                }).catch(err => {
                    alert("json down load failed after 2 mts waiting");
                    this.setState({ vid_width: "0", img_width: "128", vid_muted: true, visible: false });
                    console.log(err)
                });

                this.setState({ vid_width: "0", img_width: "128", vid_muted: true, visible: false });
                console.log(err);
            });

    }

    Store_S3 = async() => {

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
            result => {
                alert("Uploaded. Wait for censoring");
                this.retrieveTC_json();

                return
            }, // doesn't run
            error => {
                alert("upload failed");
                this.setState({ visible: false });
                return
            } // shows "Error: Whoops!" after 1 second
        );
    }





    render() {

        return (

            <div className="App">
        
        
        {this.state.visible ? (
        <img src={loading} alt="loading.." />
         
  ) : null}
        
        <p>
        <input type="file" onChange={this.onChange} />
        {this.state.file_chosen ? (<button onClick={this.submit_video}>Video Moderation(identify unsafe contents)</button>
        ) : null}
        </p>
        <p>
        <img src={censr} alt="censor" width={this.state.img_width} height="70" />
        </p>
        <p>        
        <video id="vid"   src={ this.state.vid_url} duration={this.state.duration} preload = 'metadata' onTimeUpdate={this.ontimeupdate}  width={this.state.vid_width} muted={this.state.vid_muted} height="352" controls/>
        </p>
        
         
      </div>
        );
    }

}




export default App;
