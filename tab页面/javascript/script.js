// JavaScript Document
function change(li){
	var lis = document.getElementsByTagName("li");
	var divs = document.getElementById("container").getElementsByTagName("div");
	
	for (var i = 0 ; i < lis.length; i++) {
		if (li == lis[i]) {
			lis[i].className = "tag";
			divs[i].className = "show";
		}
		else {
			lis[i].className = "";
			divs[i].className = "hidden"; 
		}
	}
}