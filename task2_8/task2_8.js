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

window.onload = function() {
	var button = document.getElementsByTagName('input');
	var container = document.getElementById('container');
	var searchInput = document.getElementById('search_input');
//处理textarea字符串，如何回避两个分隔符中间的空字符
	function dealInput() {
		var input = document.getElementsByTagName('textarea')[0].value.trim();
			if (input.length === 0) {
				alert("请输入任意有效字符！");
				return;
			} else {
				var arr = input.split(/[^0-9a-zA-Z\u4e00-\u9fa5]+/).filter(function (e) {
					if (e!=null && e.length>0) {
						return true;
					} else {
						return false;
					} 
					});
				return arr;	
			}
	}

	var queue = {
		text: [],
		leftIn: function() {
			var input = dealInput();
			for (var i = 0; i < input.length; i++) {
				this.text.unshift(input[i]);
			}
			document.getElementsByTagName('textarea')[0].value = '';
			this.render();
		},
		rightIn: function() {
			var input = dealInput();
			for (var i = 0; i < input.length; i++) {
				this.text.push(input[i]);
			}
			document.getElementsByTagName('textarea')[0].value = '';
			this.render();
		},
		leftOut: function() {
			if (this.text.length != 0) {
				alert("移除左侧" + this.text.shift());
				this.render();
			} else {
				alert("队列为空");
			}
		},
		rightOut: function() {
			if (this.text.length != 0) {
				alert("移除右侧" + this.text.pop());
				this.render();
			} else {
				alert("队列为空");
			}
		},
		render: function() {
			var html = "";
			for (var i = 0; i < this.text.length; i++) {
				html += '<div class="square">' + this.text[i] +'</div>';
			}
			container.innerHTML = html;
			addDivDelEvent();
		},
		delete: function(id) {
			this.text.splice(id, 1);
			this.render();
		}
	}
//为container中的每个div绑定删除函数
	function addDivDelEvent(){
		for (var i = 0; i < container.childNodes.length; i++) {
			//这里要使用闭包，否则永远绑定到指定div上的delete函数的参数永远等于跳出时的i值(length);
			addEvent(container.childNodes[i], "click",function(i) {
				return function () {
					return queue.delete(i);	
				};
			}(i));
		}
	}
//查询键点击效果
	function search() {
		var highLight = [];
		if (searchInput.value.length === 0) {
			return;
		} else {
			for (var i = 0; i < queue.text.length; i++) {
				if (queue.text[i] === searchInput.value) {
					highLight.push(i);
				}
			}
		}
		queue.render();//消除之前的查询
		showHigh(highLight);
		searchInput.value = "";
	}
//显示匹配元素
	function showHigh(highLight) {
		var square = document.getElementsByClassName('square');
		while (highLight.length > 0) {
			square[highLight.pop()].className += " highLight";
		} 		
	}

//为4个按钮绑定函数
	addEvent(button[0], "click", function() {
		queue.leftIn();
	});
	addEvent(button[1], "click", function() {
		queue.rightIn();
	});
	addEvent(button[2], "click", function() {
		queue.leftOut();
	});
	addEvent(button[3], "click", function() {
		queue.rightOut();
	});
	addEvent(button[4],"click", function () {
		search();
	});
}


