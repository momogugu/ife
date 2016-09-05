//事件绑定函数，兼容浏览器差异
function addEvent(ele, event, handle) {
	if (ele.addEventListener) {
		ele.addEventListener(event, handle, false);
	} else if (ele.attachEvent) {
		ele.attachEvent(ele, "on"+event, handle);
	} else {
		ele["on"+event] = handle;
	}
}


var number = document.getElementById('num-input');
var button = document.getElementsByTagName('input');
var container = document.getElementById('container');
var attention = document.getElementById('lookMe');

function leftIn() {
	if (number.value.length<=0 || (!number.value.match(/^\d+$/))) {
		attention.innerHTML = "Please enter an interger!";
		number.value = null;
		return;
	} else {
		var newNode = document.createElement('div');
		newNode.innerHTML = number.value;
		container.insertBefore(newNode, container.firstChild);
		number.value = null;
	}
}

function rightIn() {
	if (number.value.length<=0 || (!number.value.match(/^\d+$/))) {
		attention.innerHTML = "Please enter an interger!";
		number.value = null;
		return;
	} else {
		var newNode = document.createElement('div');
		newNode.innerHTML = number.value;
		container.appendChild(newNode);
		number.value = null;
	}
}

function leftOut() {
	if (container.hasChildNodes()) {
		attention.innerHTML = "Left pop " + container.childNodes[0].innerHTML;
		container.removeChild(container.childNodes[0]);
	} else {
		attention.innerHTML = "The queue is already empty!";
		return;
	}
}

function rightOut() {
	if (container.hasChildNodes()) {
		attention.innerHTML = "Right pop " + container.lastChild.innerHTML;
		container.removeChild(container.lastChild);
	} else {
		attention.innerHTML = "The queue is already empty!";
		return;
	}
}

addEvent(button[1], "click", leftIn);
addEvent(button[2], "click", rightIn);
addEvent(button[3], "click", leftOut);
addEvent(button[4], "click", rightOut);