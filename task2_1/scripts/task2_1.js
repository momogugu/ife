/*给按钮button绑定一个点击事件
在事件处理函数中获取aqi-input输入的值，并显示在aqi-display中*/
var display = function() {
	if (!document.getElementById) return false;
	var input = document.getElementById('aqi-input');
	var output = document.getElementById('aqi-display');
	var num = input.value;
	if (!isNaN(num) && (num>=0) && (num<=1000)) {
		output.innerHTML = num;
	} else{
		output.innerHTML = num + "不是有效的AQI数值，请重新输入0-1000的有效整数！";
	}
};

var button = document.getElementById('button');
button.onclick = function() {
	display();
}
var input = document.getElementById('aqi-input');
input.onkeyup = function(event) {
	if (event.keyCode === 13) {
		display();
	}
}