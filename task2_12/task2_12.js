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
//选中节点
var selected;
function selectNode() {
	for (var i = 0; i < divList.length; i++) {
		addEvent(divList[i], 'click', function (e) {
			reset();
			this.style.backgroundColor = '#DB19CA';
			e.stopPropagation();
			selected = this;
		});
	}
}
//删除节点
function deleteNode() {
	if (selected) {
		var parent = selected.parentNode;
		parent.removeChild(selected);
		selected = null;//清除selected
	} else {
		alert('请先选中要删除的节点');		
	}
}
//增加节点
function insertNode(text) {
	if (selected) {
		var newDiv = document.createElement('div');
		newDiv.innerHTML = text;
		selected.appendChild(newDiv);
	} else {
		alert('先选中要操作的节点');
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
	selected = [];
	clearInterval(timer);
	var divs = document.getElementsByTagName('div');
	for (var i = 0; i < divs.length; i++) {
		divs[i].style.backgroundColor = 'white';
	}
}

window.onload = function () {
	var button = document.getElementsByTagName('input');
	var tree = document.getElementById('root');

	traverseDt(tree);
	selectNode();

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
	addEvent(button[5], "click", function () {
		deleteNode();
	});
	addEvent(button[7], "click", function () {
		if (button[6].value) {
			insertNode(button[6].value);
		} else {
			alert("请填写新增节点的内容");
		}
		button[6].value = '';
		traverseDt(tree);//更新divList
		selectNode();//给新增的div绑定click事件
	});
}