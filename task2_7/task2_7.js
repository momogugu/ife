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
//遍历数组方法，对该数组本身进行操作
function each(arr, fn) {
	for (var i = 0; i < arr.length; i++) {
		fn(arr[i],i);
	}
}

window.onload = function() {
	var number = document.getElementById('num-input');
	var button = document.getElementsByTagName('input');
	var container = document.getElementById('container');
	var attention = document.getElementById('lookMe');
	//定义队列对象
	var queue = {
		str: [90,100,23,15,60],
		leftIn: function(num) {
			this.str.unshift(num);
			this.paint();
			button[0].value = '';
			lookMe.innerHTML = "left push " + num;
		},
		rightIn: function(num) {
			this.str.push(num);
			this.paint();
			button[0].value = '';
			lookMe.innerHTML = "right push" + num;
		},
		leftOut: function() {
			if (this.str.length != 0) {
				lookMe.innerHTML = "left pop " + this.str.shift();
				this.paint();
			} else{
				lookMe.innerHTML = "The queue is already empty!";
			}
		},
		rightOut: function() {
			if (this.str.length != 0) {
				lookMe.innerHTML = "right pop " + this.str.pop();
				this.paint();
			} else{
				lookMe.innerHTML = "The queue is already empty!";
			}
		},
		paint: function() {
			var text = "";
			each(this.str,function(item) {
				text += '<div style="height:' + parseInt(item)*2 + 'px"></div>';
			});
			container.innerHTML = text;
			addDivDelEvent();
		},
		delete: function(id) {
			this.str.splice(id, 1);
			this.paint();
		},
		bubbleSort: function() {
			var len = this.str.length;
			if (len != 0) {
				lookMe.innerHTML = "bubblesorting!";
				var i = len-1, j = 0;
				timer = setInterval(function() {
					if (i < 1) {
						clearInterval(timer);
					}
					if (j == i) {
						i --;
						j = 0;
					}
					if (queue.str[j] > queue.str[j+1]) {
						var temp = queue.str[j];
						queue.str[j] = queue.str[j+1];
						queue.str[j+1] = temp;
						queue.paint();
					}	
					j ++;
				}, 100);
			} else {
				lookMe.innerHTML = "The queue is empty!";
			}
		}
	}
	//初始化渲染
	queue.paint();

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

	//为4个按钮绑定函数
	addEvent(button[1], "click", function() {
		var input = button[0].value;
		if (input>=10 && input<=100) {
			if (queue.str.length < 60) {
				queue.leftIn(input);
			} else {
				alert("Sorry, you have already entered 60 numbers!");
			}		
		} else {
			lookMe.innerHTML = "Please enter an interger between 10 and 100!";
		}
	});
	addEvent(button[2], "click", function() {
		var input = button[0].value;
		if (input>=10 && input<=100) {
			if (queue.str.length < 60) {
				queue.rightIn(input);
			} else {
				alert("Sorry, you have already entered 60 numbers!");
			}
		} else {
			lookMe.innerHTML = "Please enter an interger between 10 and 100!";
		}
	});
	addEvent(button[3], "click", function() {
		queue.leftOut();
	});
	addEvent(button[4], "click", function() {
		queue.rightOut();
	});
	addEvent(button[5], "click", function() {
		queue.bubbleSort();
	});
}

