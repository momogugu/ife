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
//封装私有变量
function TreeNode(obj) {
	this.parentNode = obj.parentNode;
	this.children = obj.children || []; //子节点
	this.data = obj.data || "";
	this.selfElement = obj.selfElement;//访问对应的DOM节点
	this.selfElement.TreeNode = this; //DOM节点访问对应的TreeNode节点
};
//原型链封装公共操作
TreeNode.prototype = {
	constructor: TreeNode,//校正constructor属性的指向

	//渲染
	render: function (arrow, visibility, toHighlight, deHighlight) {
		if (arguments.length < 3) {
			toHighlight = false;
			deHighlight = false;
		}
		if (arrow) {
			if (this.isLeaf()) {//叶节点，设为空箭头
				this.selfElement.getElementsByClassName('arrow')[0].className = "arrow empty-arrow";
			}
			else if (this.isFolded()) {//折叠状态，设为右箭头
				this.selfElement.getElementsByClassName('arrow')[0].className = "arrow right-arrow";
			} else {//展开状态，设为下箭头
				this.selfElement.getElementsByClassName('arrow')[0].className = "arrow down-arrow";
			}
		}
		if (visibility) {//改变可见性
			if (this.selfElement.className.indexOf("nodebody-visible") == -1) {//本不可见，改为可见
				this.selfElement.className = this.selfElement.className.replace("hidden", "visible");
			} else {//改为不可见
				this.selfElement.className = this.selfElement.className.replace("visible", "hidden");
			}
		}
		if (toHighlight) {
			this.selfElement.getElementsByClassName("node-title")[0].className = "node-title node-title-highlight";
		}
		if (deHighlight) {
			this.selfElement.getElementsByClassName("node-title")[0].className = "node-title";
		}
	},
	//判断是否为叶节点(没有子节点的节点)
	isLeaf: function () {
		return this.children.length == 0;
	},
	//判断节点是否处于折叠状态
	isFolded: function () {
		if (this.isLeaf()) return false; //叶节点时返回false
		if (this.children[0].selfElement.className == 'nodebody-visible') return false;
		return true;
	},
	//展开、收拢节点
	toggleFold: function () {
		if (this.isLeaf()) return this; //叶节点无子节点无需操作
		//改变所有子节点的可见状态
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].render(false, true);
		}
		//渲染本节点的箭头
		this.render(true, false);
		return this; //返回自身，以便链式操作
	},
	//增加子节点
	addChild: function (text) {
		if (text == null) return this; //prompt点击取消返回null
		if (text.trim() == "") {
			alert('节点不能为空！');
			return this;
		}
		if (!this.isLeaf() && this.isFolded()) {
			this.toggleFold();
		}//若当前节点有子节点且子节点不可见，则将其展开
		//创建新的DOM节点并附加
		var newNode = document.createElement("div");
		newNode.className = "nodebody-visible";
		var newHeader = document.createElement('label');
		newHeader.className = 'node-header';
		var newSymbol = document.createElement('div');
		newSymbol.className = 'arrow empty-arrow';
		var  newTitle = document.createElement('span');
		newTitle.className = 'node-title';
		newTitle.innerHTML = text;
		var newAdd = document.createElement('img');
		newAdd.className = 'addIcon'
		newAdd.src = "add.png";
		var newDelete = document.createElement('img');
		newDelete.className = 'delIcon'
		newDelete.src = "delete.png";
		newHeader.appendChild(newSymbol);
		newHeader.appendChild(newTitle);
		newHeader.appendChild(newAdd);
		newHeader.appendChild(newDelete);
		newNode.appendChild(newHeader);
		this.selfElement.appendChild(newNode);
		//创建对应的TreeNode对象并添加到子节点队列
		this.children.push(new TreeNode({parentNode:this, children:[], data: text, selfElement: newNode}));
		//渲染自身样式
		this.render(true, false);
		return this;
	},
	//删除节点
	deleteNode: function () {
		var i;
		if (!this.isLeaf()) {
			for (var i = 0; i < this.children.length; i++) {
				this.children[i].deleteNode();
			}
		}//递归删除子节点
		this.parentNode.selfElement.removeChild(this.selfElement); //移除对应的DOM节点
		for (var i = 0; i < this.parentNode.children.length; i++) {//从父节点删除该孩子
			if(this.parentNode.children[i] == this) {
				this.parentNode.children.splice(i, 1);
				break;
			}
		}
		//调整父节点箭头样式
		this.parentNode.render(true, false);
	}
};

var treeRoot = new TreeNode({parentNode: null, children: [], data: "前端工程师", selfElement: document.getElementsByClassName('nodebody-visible')[0]});

//为root绑定事件，处理所有节点的点击事件
addEvent(treeRoot.selfElement, 'click', function (e) {
	var target = e.target || e.srcElement;
	var domNode = target;
	while(domNode.className.indexOf("nodebody") == -1) domNode = domNode.parentNode; //找到类名含有nodebody的DOM节点
	selectedNode = domNode.TreeNode; //获取DOM对象对应的TreeNode对象
	//如果点在节点文字或箭头上
	if (target.className.indexOf("node-title") != -1 || target.className.indexOf("arrow") != -1) {
		selectedNode.toggleFold();//触发toggle操作
	} else if (target.className == "addIcon") { //点在加号上
		selectedNode.addChild(prompt("请输入子节点的内容："));
	} else if (target.className == "delIcon") { //点在减号上
		selectedNode.deleteNode();
	}
});

//给root绑定广度优先搜索函数，无需访问DOM，返回一个搜索结果队列
treeRoot.search = function (query) {
	var resultList = [];
	//广度优先搜索
	var queue = []; //辅助队列，顺序存储待访问节点
	var current = this;
	queue.push(current); //当前节点入队
	while(queue.length > 0) {
		current = queue.shift();//从待访问队列取出首节点访问
		current.render(false, false, false, true); //还原当前节点颜色
		if (current.data == query) resultList.push(current); //找到了
		for (var i = 0; i < current.children.length; i++) {
			queue.push(current.children[i]); //将当前节点的所有子节点入队
		}
	}
	return resultList;
};

//搜索并显示结果
addEvent(document.getElementById('search'), "click", function () {
	var text = document.getElementById('searchText').value.trim();
	if (text == "") {
		document.getElementById("result").innerHTML = "请输入查询内容！";
		return;
	}
	var resultList = treeRoot.search(text); //执行搜索
	console.log(resultList);
	//处理搜索结果
	if (resultList.length == 0) {
		document.getElementById("result").innerHTML = "没有查询到符合条件的节点！";
	} else {
		document.getElementById("result").innerHTML = "查询到"+resultList.length+"个符合条件的节点！";
		var pathNode;
		for (var i = 0; i < resultList.length; i++) {
			pathNode = resultList[i];
			pathNode.render(false, false, true, false);
			while(pathNode.parentNode != null) {
				if (pathNode.selfElement.className == "nodebody-hidden") {
					pathNode.parentNode.toggleFold();
				}
				pathNode = pathNode.parentNode;
			}
		}
	}
});

//清除搜索结果
addEvent(document.getElementById('clear'), "click", function () {
	document.getElementById("searchText").value = "";
	treeRoot.search(null); //清楚高亮样式
	document.getElementById('result').innerHTML = "";
});

//动态生成Demo树
treeRoot.addChild("技术").addChild("IT公司").addChild("谈笑风生");
treeRoot.children[0].addChild("HTML5").addChild("CSS3").addChild("JavaScript").addChild("PHP").addChild("Node.JS").toggleFold();
treeRoot.children[0].children[4].addChild("JavaScript").toggleFold();
treeRoot.children[1].addChild("百度").addChild("腾讯").addChild("大众点评").toggleFold();
treeRoot.children[2].addChild("身经百战").addChild("学习一个").addChild("吟两句诗").toggleFold();
treeRoot.children[2].children[2].addChild("苟利国家生死以").toggleFold();
//初始化查询Demo值
document.getElementById("searchText").value = "JavaScript";