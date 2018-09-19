var FileHelper =
{
　　SaveFileAs: function (path,fileName)
    {
		var s_fileNmae = Pointer_stringify(fileName);
		var s_content = Pointer_stringify(path);
		var element_a = document.createElement('a');
		document.body.appendChild(element_a);
		element_a.setAttribute("href", s_content);
		element_a.setAttribute("download", s_fileNmae);
		element_a.setAttribute("id", "trigger");
                element_a.setAttribute("traget", "_blank");
		trigger.click();
		document.body.removeChild(element_a);
    },
    AlertInfomation: function(str)
    {
       alert(Pointer_stringify(str));
    },
    OpenUrlNewWindow:function(url)
    {
        window.open(Pointer_stringify(url),"_blank");
    },
	DownloadFile : function(name, data, type) {
		var fileName = Pointer_stringify(name);
		var fileType = Pointer_stringify(type);
		var textToWrite = Pointer_stringify(data);
		var textType = 'text/plain';
		switch(fileType) {
			case 'txt':
				textType = 'text/plain';
				fileName += '.txt';
				break;
			case 'csv':
				textType = 'text/csv';
				fileName += '.csv';
				break;
		}
		
		if (fileName) {
			var textFileAsBlob = new Blob(['\ufeff', textToWrite], {type: textType});
			if ('msSaveOrOpenBlob' in navigator) {
				navigator.msSaveOrOpenBlob(textFileAsBlob, fileName);
			} else {
				var downloadLink = document.createElement('a');
				console.log(fileName);
				downloadLink.download = fileName;
				downloadLink.innerHTML = 'Download File';
				if ('webkitURL' in window) {
					downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
				} else {
					downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
					downloadLink.onclick = destroyClickedElement;
					downloadLink.style.visibility = 'hidden';
					document.body.appendChild(downloadLink);
				}
				downloadLink.click();
			}
		}
		
		function destroyClickedElement(event) {
			document.body.removeChild(event.target);
		}
    },
	UploadFile : function(url, userName, assetName, fileName, fileType) {
		str_url = Pointer_stringify(url);
		str_userName = Pointer_stringify(userName);
		str_assetName = Pointer_stringify(assetName);
		str_fileName = Pointer_stringify(fileName);
		str_fileType = Pointer_stringify(fileType);
		if (!document.getElementById('FileUploadPluginInput'))
			InitInput();
			
		if (!document.getElementById('crypt'))
			InitCrypt();
			
		var input = document.getElementById('FileUploadPluginInput');
		ChangeInputAccept();
		input.click();
 
		function InitInput() {
			var inputFile = document.createElement('input');
			inputFile.type = 'file';
			inputFile.id = 'FileUploadPluginInput';
			inputFile.style.visibility = 'hidden';
			inputFile.onclick = function (event) {
				this.value=null;
			};
			inputFile.onchange = LoadFile;
			inputFile.onerror = function() {
				SendMessage('UploadPanel', 'OnUploadError');
			}
			document.body.appendChild(inputFile);
		}

		function LoadFile(event) {
            var fileInput = event.target.files;
            if (!fileInput || !fileInput.length) return;
			SendMessage('UploadPanel', 'OnUploadStart');
			
            var reader = new FileReader();
            reader.onloadend = function(event) {
				var array = event.target.result;
				var error = event.target.error;
				if (error) SendMessage('UploadPanel', 'OnUploadError');
				
                CryptFile(event, function (hex, err) {
					if (err) SendMessage('UploadPanel', 'OnUploadError');
                    console.log(hex);
					UploadFile(hex, fileInput[0]);
                });
            };

            reader.readAsArrayBuffer(fileInput[0]);
        }
		
		function UploadFile(md5, file) {
			var xhr = new XMLHttpRequest();
			xhr.open('POST', str_url+'/upload', true);
			xhr.onload = function(event) {
				console.log('upload success');
				SendMessage('UploadPanel', 'OnUploadEnd');
			}
			
			var fd = new FormData();
			fd.append('md5', md5);
			fd.append('username', str_userName);
			fd.append('assetname', str_assetName);
			fd.append('encordfilepath', str_fileName);
			fd.append('file', file);
			xhr.send(fd);
		}

		function InitCrypt() {
			var head = document.getElementsByTagName('head')[0];
			var script = document.createElement('script');
			script.id = 'crypt';
			script.type = 'text/javascript';
			script.src = 'TemplateData/md5.min.js';
			head.appendChild(script);
		}
		
		function CryptFile(event, onload) {
			try {
			    if (md5.update) {
			        var batch = 1024 * 1024;
			        var start = 0;
			        var current = md5;
			        var asyncUpdate = function () {
                        if (start < event.total) {
                            var end = Math.min(start+batch, event.total);
                            current = current.update(event.target.result.slice(start, end));
                            start = end;
                            setTimeout(asyncUpdate);
                        } else {
                            if (onload) onload(current.hex());
                        }
                    }
                    asyncUpdate();
                } else {
			        if (onload) onload(md5(event.target.result).hex());
                }
            } catch (e) {
			    console.log(e);
				if (onload) onload(null, e);
            }
        }
		
		function ChangeInputAccept() {
			switch(str_fileType) {
				case "Csv":
					input.accept = ".csv";
					break;
				case "Picture":
					input.accept = "image/png,image.jpeg";
					break;
				case "Html":
					input.accept = ".html";
					break;
				case "Pdf":
					input.accept = ".pdf";
					break;
				case "Movie":
					input.accept = "video/mp4";
					break;
				default:
					input.accept = "*";
					break;
			}
		}
    }
};
 
mergeInto(LibraryManager.library, FileHelper);