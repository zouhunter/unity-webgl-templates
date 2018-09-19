function UnityProgress (dom) {
	this.progress = 0.0;
	this.message = "";
	this.dom = dom;

	var parent = dom.parentNode;

	//var progressItem = document.getElementsByClassName("progress");

	this.SetProgress = function (progress) { 
	    this.progress =progress;
	    //progressItem.innerHTML = progress;
		this.Update();
	}

	this.SetMessage = function (message) {
	    //alert(progress);		
		this.Update();
	}

	this.Clear = function() {
	}

	this.Update = function() {
		document.getElementById("p1").innerHTML="<br> <br> <br> <br> <br> Loading...";
	}

	this.Update ();
}