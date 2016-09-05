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

function countLength(str) {
			var inputLength = 0;
			for (var i = 0; i < str.length; i++) {
				if(str.charCodeAt(i)>=0 && str.charCodeAt(i)<=128) {
					inputLength +=1;//英文字母、数字、英文符号长度为1
				} else {
					inputLength +=2;//汉子，中午符号长度为2
				}
			}
			return inputLength;
		}

var check = function (ele) {
	var input = document.getElementsByTagName('input');
	var nameArr=["名称不能为空","名称不能包含除中文、英文及数字以外的字符","名称长度过短","名称长度过长","名称可用"]
	var passwordArr=["密码不能为空","密码不能包含除英文及数字以外的字符","密码长度过短","密码长度过长","密码可用"]
	var againArr=["两次密码不相同","密码正确"];
	var emailArr=["邮箱不能为空","邮箱格式错误","邮箱格式正确"];
	var phoneArr=["手机号码不能为空","手机号码格式错误","手机号码格式正确"];
	switch(ele) {
		case input[0]:
			if (ele.value.length == "") return nameArr[0];
			else if (!ele.value.match(/^[0-9A-Za-z\u4E00-\u9FA5]+$/)) return nameArr[1];
			else {
				if (countLength(ele.value) < 4) return nameArr[2];
				if (countLength(ele.value) > 16) return nameArr[3];
			}
			return nameArr[4];
			break;
		case input[1]:
			if (ele.value.length == "") return passwordArr[0];
			else if (!ele.value.match(/^[0-9a-zA-Z]+$/)) return passwordArr[1];
			else {
				if (countLength(ele.value) < 9) return passwordArr[2];
				if (countLength(ele.value) > 24) return passwordArr[3];
			}
			return passwordArr[4];
			break;
		case input[2]:
			if (input[2].value == input[1].value) return againArr[1];
			return againArr[0];
			break
		case input[3]:
			if (ele.value.length == "") return emailArr[0];
			else if (!( /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/).test(ele.value)) return emailArr[1];
			else return emailArr[2];
			break;
		case input[4]:
			if (ele.value.length == "") return phoneArr[0];
			else if (!(/^(1(3[0-9]|4[57]|5[0-35-9]|8[0-9]|70))\d{8}$/).test(ele.value)) return phoneArr[1];
			else return phoneArr[2];
			break
	}
}

window.onload = function () {
	var name = document.getElementById('name');
	var nameInform = document.getElementById('nameInform');
	var password = document.getElementById('password');
	var passwordInform = document.getElementById('passwordInform')
	var passwordAgain = document.getElementById('password-again');
	var againInform = document.getElementById('againInform');
	var email = document.getElementById('email');
	var emailInform = document.getElementById('emailInform');
	var phone = document.getElementById('phone');
	var phoneInform = document.getElementById('phoneInform');
	var hint = document.getElementsByClassName('hint');
	var button = document.getElementById('btn');

	addEvent(name, 'focus', function () {
		nameInform.innerHTML = "必填，长度为4~16个字符，只允许输入中文、英文字母和数字,中文占2字符";
		nameInform.style.color = 'grey';
		hint[0].style.display = "table-row";
		name.style.border = "2px solid lightblue";
	});
	addEvent(name, 'blur', function () {
		nameInform.innerHTML = check(name);
		if (nameInform.innerHTML == "名称可用") {
			nameInform.style.color = 'lightgreen';
			hint[0].style.display = "table-row";
			name.style.border = "2px solid lightgreen";
		} else {
			nameInform.style.color = 'red';
			hint[0].style.display = "table-row";
			name.style.border = "2px solid red";
		}
	});
	addEvent(password, 'focus', function () {
		passwordInform.innerHTML = "必填，长度为9~24个字符，只允许输入英文字母和数字";
		passwordInform.style.color = 'grey';
		hint[1].style.display = "table-row";
		password.style.border = "2px solid lightblue";
	});
	addEvent(password, 'blur', function () {
		passwordInform.innerHTML = check(password);
		if (passwordInform.innerHTML == "密码可用") {
			passwordInform.style.color = 'lightgreen';
			hint[1].style.display = "table-row";
			password.style.border = "2px solid lightgreen";
		} else {
			passwordInform.style.color = 'red';
			hint[1].style.display = "table-row";
			password.style.border = "2px solid red";
		}
	});
	addEvent(passwordAgain, 'focus', function () {
		againInform.innerHTML = "请再次输入密码";
		againInform.style.color = 'grey';
		hint[2].style.display = "table-row";
		passwordAgain.style.border = "2px solid lightblue";
	});
	addEvent(passwordAgain, 'blur', function () {
		if (check(password)== "密码可用") {
			againInform.innerHTML = check(passwordAgain);
			if (againInform.innerHTML == "密码正确") {
				againInform.style.color = 'lightgreen';
				hint[2].style.display = "table-row";
				passwordAgain.style.border = "2px solid lightgreen";
			} else {
				againInform.style.color = 'red';
				hint[2].style.display = "table-row";
				passwordAgain.style.border = "2px solid red";
			}
		} else {
			againInform.innerHTML = "请正确输入第一次密码";
			againInform.style.color = 'red';
			hint[2].style.display = "table-row";
			passwordAgain.style.border = "2px solid red";
		}
	});
	addEvent(email, 'focus', function () {
		emailInform.innerHTML = "必填，请输入正确的邮箱地址";
		emailInform.style.color = 'grey';
		hint[3].style.display = "table-row";
		email.style.border = "2px solid lightblue";
	});
	addEvent(email, 'blur', function () {
		emailInform.innerHTML = check(email);
		if (emailInform.innerHTML == "邮箱格式正确") {
			emailInform.style.color = 'lightgreen';
			hint[3].style.display = "table-row";
			email.style.border = "2px solid lightgreen";
		} else {
			emailInform.style.color = 'red';
			hint[3].style.display = "table-row";
			email.style.border = "2px solid red";
		}
	});
	addEvent(phone, 'focus', function () {
		phoneInform.innerHTML = "必填，请输入正确的手机号码";
		phoneInform.style.color = 'grey';
		hint[4].style.display = "table-row";
		phone.style.border = "2px solid lightblue";
	});
	addEvent(phone, 'blur', function () {
		phoneInform.innerHTML = check(phone);
		if (phoneInform.innerHTML == "手机号码格式正确") {
			phoneInform.style.color = 'lightgreen';
			hint[4].style.display = "table-row";
			phone.style.border = "2px solid lightgreen";
		} else {
			phoneInform.style.color = 'red';
			hint[4].style.display = "table-row";
			phone.style.border = "2px solid red";
		}
	});
	addEvent(button, "click", function () {
		var flag = (name.style.border=="2px solid lightgreen" && password.style.border=="2px solid lightgreen" && passwordAgain.style.border=="2px solid lightgreen" && email.style.border=="2px solid lightgreen" && phone.style.border=="2px solid lightgreen");
		if (flag) {
			alert("提交成功");
		} else {
			alert("提交失败");
		}
	});
}