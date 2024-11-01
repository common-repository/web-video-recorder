var etherRecorder=document.getElementById('recorder');

var formTag=document.createElement('form');
formTag.setAttribute('method','POST');

var videoEther = document.createElement('video');
videoEther.setAttribute('id', 'gum');
videoEther.setAttribute('autoplay', false);
videoEther.setAttribute('muted', false);
formTag.appendChild(videoEther);

var videoEther1 = document.createElement('video');
videoEther1.setAttribute('id', 'recorded');
videoEther1.setAttribute('loop', true);
videoEther1.setAttribute('controls', true);
videoEther1.setAttribute('autoplay',false);
formTag.appendChild(videoEther1);

var formTitle=document.createElement('div');

formTitle.setAttribute('class','form-group form_class');
var formLabel=document.createElement('label');
formLabel.innerHTML="Title :";
formTitle.appendChild(formLabel);

formInput=document.createElement('input');
formInput.setAttribute('type','text');
formInput.setAttribute('name','custom_post_title');
formInput.setAttribute('id','custom_post_title');
formInput.setAttribute('class','form-control');
formTitle.appendChild(formInput);
formTag.appendChild(formTitle);



var formDescription=document.createElement('div');
formDescription.setAttribute('class','form-group');

formDescriptTitle=document.createElement('label');
formDescriptTitle.innerHTML="Description :";
formDescription.appendChild(formDescriptTitle);
formTag.appendChild(formDescriptTitle);

formDescriptionTextarea=document.createElement('textarea');
formDescriptionTextarea.setAttribute('name','custom_post_description');
formDescriptionTextarea.setAttribute('id','custom_post_description');
formDescriptionTextarea.setAttribute('rows','5');
formDescriptionTextarea.setAttribute('cols','8');
formDescription.appendChild(formDescriptionTextarea);
formTag.appendChild(formDescription);

var buttonDiv = document.createElement('div');
buttonDiv.setAttribute('class','button_top_margin');

var buttonRecord = document.createElement('button');
buttonRecord.setAttribute('type', 'button');
buttonRecord.setAttribute('id', 'record');
buttonRecord.setAttribute('disabled', true);

var buttonPlay = document.createElement('button');
buttonPlay.setAttribute('type', 'button');
buttonPlay.setAttribute('id', 'play');
buttonPlay.setAttribute('disabled', true);

var buttonDownload = document.createElement('button');
buttonDownload.setAttribute('type', 'button');
buttonDownload.setAttribute('id', 'download');
buttonDownload.setAttribute('disabled', true);

var buttonUpload = document.createElement('button');
buttonUpload.setAttribute('type', 'button');
buttonUpload.setAttribute('id', 'upload');
buttonUpload.setAttribute('disabled', true);

var buttonRecordtextnode = document.createTextNode("Start Recording");
buttonRecord.appendChild(buttonRecordtextnode);

var buttonPlaytextnode = document.createTextNode("Play");
buttonPlay.appendChild(buttonPlaytextnode);

var buttonDownloadtextnode = document.createTextNode("Download");
buttonDownload.appendChild(buttonDownloadtextnode);

var buttonUploadtextnode = document.createTextNode("Post");
buttonUpload.appendChild(buttonUploadtextnode);

buttonDiv.appendChild(buttonRecord);
buttonDiv.appendChild(buttonPlay);
buttonDiv.appendChild(buttonDownload);
buttonDiv.appendChild(buttonUpload);
formTag.appendChild(buttonDiv);
etherRecorder.appendChild(formTag);


