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

//切换城市的时候，显示城市对应的学校
function showCollege() {
	var data = [
        ["北京大学", "清华大学", "中国人民大学"],
        ["复旦大学", "上海交通大学", "同济大学"],
        ["武汉大学", "华中科技大学", "中国地质大学"],
        ["厦门大学", "集美大学", "华侨大学"]
    ]
	var city = document.getElementById('city');
	var school = document.getElementById('school');
	var selected = city.selectedIndex;
	school.innerHTML = "";
	for (var i = 0; i < data[selected].length; i++) {
		var opt = document.createElement('option');
		opt.innerHTML = data[selected][i];
		school.appendChild(opt);
	}
}

//在校生和非在校生切换时改变选择内容
function radioChange() {
	var undergraduates = document.getElementById('undergraduate');
	var graduates = document.getElementById('graduate');
	var college = document.getElementById('college');
	var company = document.getElementById('company');
	if (undergraduates.checked) {
		college.style.display = "block";
		company.style.display = "none";
	} else if (graduates.checked) {
		college.style.display = "none";
		company.style.display = "block";
	}
}
var student = document.getElementById('student');
addEvent(student, 'click', radioChange);
var city = document.getElementById('city');
addEvent(city, 'change', showCollege);