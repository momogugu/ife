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
//前序遍历，若二叉树为空，则空操作返回，否则先访问根结点，然后前序遍历左子树，再前序遍历右子树。
function preOrder(node) {
	if (node != null) {
		divList.push(node);
		preOrder(node.firstElementChild);
		preOrder(node.lastElementChild);
	}
}
//中序遍历，若树为空，则空操作返回，否则从根结点开始（注意并不是先访问根结点），中序遍历根结点的左子树，然后是访问根结点，最后中序遍历右子树。
function inOrder(node) {
	if (node != null) {
		inOrder(node.firstElementChild);//先访问左子树
		divList.push(node);//再访问根节点
		inOrder(node.lastElementChild);//最后访问右子树
	}
}
//后序遍历，若树为空，则空操作返回，否则从左到右先叶子后结点的方式遍历访问左右子树，最后访问根结点。
function postOrder(node) {
	if (node != null) {
		postOrder(node.firstElementChild);//后序遍历左子树
		postOrder(node.lastElementChild);//后序遍历右子树
		divList.push(node);//访问根节点
	}
}

var timer = null;
//颜色变化函数
function changeColor() {
	var i = 0;
	divList[i].style.backgroundColor = 'lightblue';
	timer = setInterval(function () {
		i ++;
		if (i >= divList.length) {
			clearInterval(timer);
			divList[i-1].style.backgroundColor = 'white';
		} else {
			divList[i-1].style.backgroundColor = 'white';
			divList[i].style.backgroundColor = 'lightblue';
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
		preOrder(tree);
		changeColor();
	});
	addEvent(button[1], "click", function () {
		reset(tree);
		inOrder(tree);
		changeColor();
	});
	addEvent(button[2], "click", function () {
		reset(tree);
		postOrder(tree);
		changeColor();
	});
}