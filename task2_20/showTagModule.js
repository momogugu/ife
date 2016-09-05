function Queue(input, container) {
	this.arrData = [];
	this.dealInput = function () {
		var str = input.value.trim();
		if (str.length) {
			var arr = str.split(/,|，|;|；|、|\s|\n|\r|\t/).filter(function (e) {
				if (e!=null && e.length>0) {
					return true;
				} else {
					return false;
				} 
				});
			this.arrData = this.arrData.concat(arr);
			this.arrData = this.delRepeat(this.arrData);
			while (this.arrData.length > 10) {
				this.arrData.shift(this.arrData[0]);
			}
			return this.arrData;	
		} 
	};
	this.delRepeat = function (arr) {
		var newArr = [];
		for (var i = 0; i < arr.length; i++) {
			if (newArr.indexOf(arr[i]) === -1) {
				newArr.push(arr[i]);
			}	
		}
		return newArr;
	};//去重
	this.render = function () {
		var html = "";
		for (var i = 0; i < this.arrData.length; i++) {
			html += '<div class="item">'+this.arrData[i]+'</div>';
		}
		container.innerHTML = html;
		input.value = "";
		addDivDelEvent(this, container);
	};//渲染
	this.deleteID = function(id) {
        this.arrData.splice(id, 1);
        this.render();
    };//删除函数deleteId	
 	this.highLight = function (i) {
		container.childNodes[i].className += " highLight";
		container.childNodes[i].innerHTML = "删除:"+container.childNodes[i].innerHTML;
	};//重新渲染
}

//为container中的每个div绑定删除函数
function addDivDelEvent(queue,container){
	for (var i = 0; i < container.childNodes.length; i++) {
		addEvent(container.childNodes[i], "mouseover", function(i){
			return function () {
				queue.highLight(i);
			}
		}(i));
		addEvent(container.childNodes[i], "mouseout", function() {
			queue.render();
		});
		//这里要使用闭包，否则永远绑定到指定div上的delete函数的参数永远等于跳出时的i值(length);
		addEvent(container.childNodes[i], "click", function(i) {
			return function () {
				queue.deleteID(i);	
			};
		}(i));
	}
}

	var tagInput = document.getElementById('box_item_input');
	var tagContainer = document.getElementById('box_item_container');
	var tag = new Queue(tagInput,tagContainer);

//为tag绑定函数
	addEvent(tagInput, "keyup", function (e) {
		if (/[,，\s\n]+/.test(tagInput.value) || e.keyCode ===13) {
			tag.dealInput();
			tag.render();
		}
	});
