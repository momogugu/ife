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

var divList = [];
//深度遍历,遍历根节点，根节点的字节点，子节点的子节点
function traverseDt(node) {
	if (node != null) {
		divList.push(node);
		traverseDt(node.firstElementChild);
		traverseDt(node.nextElementSibling);
	}
}

//广度遍历，遍历根节点，根节点的所有子节点，子节点的所有子节点
//队列初始化，将根节点压入队列。当队列不为空，进行如下操作：弹出一个节点，访问，若左子节点或右子节点不为空，将其压入队列。
function traverseBt(node) {
	var p = null;
	var nodeList = [];
	if (node != null) {
		nodeList.push(node);
	}
	while (nodeList.length > 0) {
		p = nodeList.shift();
		divList.push(p);
		if (p.firstElementChild) {
			nodeList.push(p.firstElementChild);
			p = p.firstElementChild;
			while (p.nextElementSibling) {
				nodeList.push(p.nextElementSibling);
				p = p.nextElementSibling;
			}
		}
	}
}

var timer = null;
//渲染
function traverseRender(text) {
	var i = 0;
	var searchList = [];
	if (divList[i].firstChild.nodeValue.trim().toLowerCase() ===  text) {
		divList[i].style.backgroundColor = 'pink';
		searchList.push(divList[i]);
	} else {
		divList[i].style.backgroundColor = 'lightblue';
	}
	timer = setInterval(function () {
		i ++;
		if (i >= divList.length) {
			clearInterval(timer);
			divList[i-1].style.backgroundColor = 'white';
			if (text!=undefined && searchList.length == 0){
				alert('没有搜索到'+text);
			} else {
				for (var j = 0; j < searchList.length; j++) {
					searchList[j].style.backgroundColor = 'pink';
				}
			}
		} else {
			divList[i-1].style.backgroundColor = 'white';
			if (divList[i].firstChild.nodeValue.trim().toLowerCase() ===  text) {
				divList[i].style.backgroundColor = 'pink';
				searchList.push(divList[i]);
			} else {
				divList[i].style.backgroundColor = 'lightblue';
			}
		}
	}, 500);
}

//初始化函数
function reset() {
	divList = [];
	clearInterval(timer);
	var divs = document.getElementsByTagName('div')
	for (var i = 0; i < divs.length; i++) {
		 divs[i].style.backgroundColor = 'white';
	}
}

window.onload = function () {
	var button = document.getElementsByTagName('input');
	var tree = document.getElementById('root');

	addEvent(button[0], "click", function () {
		reset(tree);
		traverseDt(tree);
		traverseRender();//传入的值的undefined
	});
	addEvent(button[1], "click", function () {
		reset(tree);
		traverseBt(tree);
		traverseRender();//传入的值的undefined
	});
	addEvent(button[3], "click", function () {
		reset(tree);
		traverseDt(tree);
		if (button[2].value) {
			traverseRender(button[2].value.trim().toLowerCase());
		} else {
			alert("请输入要查找的内容");
		}
		button[2].value = '';
	});
	addEvent(button[4], "click", function () {
		reset(tree);
		traverseBt(tree);
		if (button[2].value) {
			traverseRender(button[2].value.trim().toLowerCase());
		} else {
			alert("请输入要查找的内容");
		}
		button[2].value = '';
	});
}