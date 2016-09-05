function Form(data) {
	this.data = data;
	this.ipt = $(data.id);
	this.tip = this.ipt.nextElementSibling;
	this.init();
}
Form.prototype = {
	init: function () {
		if (this.data.type=='radio'||this.data.type=='checkbox') {
			this.necessary_tip();
			this.tip.innerHTML += '请选择您的'+this.data.label;
			this.tip.className = 'default';
			this.ipt.className = 'default';
		} else {
			addEvent(this.ipt, 'focus', this.default_tip.bind(this));
		}
		if (this.data.necessary) {
			addEvent(this.ipt, 'blur', this.validate.bind(this));
			addEvent(this.ipt, 'change', this.validate.bind(this));
		}
	},
	necessary_tip: function () {
		var html = '';
		if (this.data.necessary) {
			html = '必填，';
		} else {
			html = '选填，';
		}
		this.tip.innerHTML = html;
	},
	default_tip: function () {
		this.necessary_tip();
		this.tip.className = 'default';
		this.ipt.className = 'default';
		var html = '';
		switch(this.data.type) {
			case 'input':
				switch(this.data.input_type) {
					case 'text':
						html = '长度为' + this.data.min_length +'~' + this.data.max_length + '个字符，只允许输入中文、英文字母和数字,中文占2字符';
						this.tip.innerHTML += html;
						break;
					case 'password':
						html = '长度为' + this.data.min_length +'~' + this.data.max_length + '个字符，只允许输入英文字母和数字';
						this.tip.innerHTML += html;
						break;
					case 'number':
					case 'email':
					case 'phone':
						html = '请输入您的' + this.data.label;
						this.tip.innerHTML += html;
						break;
				}
				break;
			case 'select':
				html = '请选择您的' + this.data.label;
				this.tip.innerHTML += html;
				break;
			case 'textarea':
				html = '长度为' + this.data.min_length +'~' + this.data.max_length + '个字符';
				this.tip.innerHTML += html;
				break; 
		}
	},
	true_tip: function () {
		this.tip.className = 'true';
		this.ipt.className = 'true';
	},
	error_tip: function () {
		this.tip.className = 'error';
		this.ipt.className = 'error';
	},
	countLength: function (str) {
		var inputLength = 0;
		for (var i = 0; i < str.length; i++) {
			if(str.charCodeAt(i)>=0 && str.charCodeAt(i)<=128) {
				inputLength +=1;//英文字母、数字、英文符号长度为1
			} else {
				inputLength +=2;//汉子，中午符号长度为2
			}
		}
		return inputLength;
	},
	validate: function () {
		switch(this.data.type) {
			case 'input':
				switch(this.data.input_type) {
					case 'text':
						if (this.ipt.value.length == "") {
							this.tip.innerHTML = this.data.label + '不能为空';
							this.error_tip();
							return false;
						} else if (!this.ipt.value.match(/^[0-9A-Za-z\u4E00-\u9FA5]+$/)) {
							this.tip.innerHTML = this.data.label + '不能包含除中文、英文及数字以外的字符';
							this.error_tip();
							return false;
						} else if (this.countLength(this.ipt.value) < this.data.min_length) {
							this.tip.innerHTML = this.data.label + '长度不能小于' + this.data.min_length;
							this.error_tip();
							return false;
						} else if (this.countLength(this.ipt.value) > this.data.max_length) {
							this.tip.innerHTML = this.data.label + '长度不能大于' + this.data.max_length;
							this.error_tip();
							return false;
						} else {
							this.tip.innerHTML = this.data.label + '可用';
							this.true_tip();
							return true;
						}
						break;
					case 'number':
						if (this.ipt.value.length == '') {
							this.tip.innerHTML = '请输入正确的' + this.data.label;
							this.error_tip();
							return false;
						} else {
							this.tip.innerHTML = this.data.label + '格式正确';
							this.true_tip();
							return true;
						}
						break;
					case 'email':
						if (this.ipt.value.length == '') {
							this.tip.innerHTML = this.data.label + '不能为空';
							this.error_tip();
							return false;
						} else if (!( /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/).test(this.ipt.value)) {
							this.tip.innerHTML = this.data.label + '格式错误';
							this.error_tip();
							return false;
						} else {
							this.tip.innerHTML = this.data.label + '格式正确';
							this.true_tip();
							return true;
						}
						break;
					case 'phone':
						if (this.ipt.value.length == '') {
							this.tip.innerHTML = this.data.label + '不能为空';
							this.error_tip();
							return false;
						} else if (!(/^(1(3[0-9]|4[57]|5[0-35-9]|8[0-9]|70))\d{8}$/).test(this.ipt.value)) {
							this.tip.innerHTML = this.data.label + '格式错误';
							this.error_tip();
							return false;
						} else {
							this.tip.innerHTML = this.data.label + '格式正确';
							this.true_tip();
							return true;
						}
						break;
					case 'password':
						if (this.ipt.value.length == "") {
							this.tip.innerHTML = this.data.label + '不能为空';
							this.error_tip();
							return false;
						} else if (!this.ipt.value.match(/^[0-9a-zA-Z]+$/)) {
							this.tip.innerHTML = this.data.label + '不能包含除英文及数字以外的字符';
							this.error_tip();
							return false;
						} else if (this.countLength(this.ipt.value) < this.data.min_length) {
							this.tip.innerHTML = this.data.label + '长度不能小于' + this.data.min_length;
							this.error_tip();
							return false;
						} else if (this.countLength(this.ipt.value) > this.data.max_length) {
							this.tip.innerHTML = this.data.label + '长度不能大于' + this.data.max_length;
							this.error_tip();
							return false;
						} else {
							this.tip.innerHTML = this.data.label + '可用';
							this.true_tip();
							return true;
						}
						break;
				}
			case 'radio':
			case 'checkbox':
				var item = this.ipt.getElementsByTagName('input');
				for (var i = 0; i < item.length; i++) {
					if(item[i].checked) {
						this.tip.innerHTML = this.data.label + '已选择';
						this.true_tip();
						return true;
					}
				}
				this.tip.innerHTML = this.data.label + '未选择';
				this.error_tip();
				break;
			case 'select':
				this.tip.innerHTML = '下拉框已选择';
				this.true_tip();
				return true;
				break;
			case 'textarea':
				if (this.ipt.value.length == "") {
					this.tip.innerHTML = this.data.label + '不能为空';
					this.error_tip();
					return false;
				}else if (this.countLength(this.ipt.value) < this.data.min_length) {
					this.tip.innerHTML = this.data.label + '长度不能小于' + this.data.min_length;
					this.error_tip();
					return false;
				} else if (this.countLength(this.ipt.value) > this.data.max_length) {
					this.tip.innerHTML = this.data.label + '长度不能大于' + this.data.max_length;
					this.error_tip();
					return false;
				} else {
					this.tip.innerHTML = this.data.label + '可用';
					this.true_tip();
					return true;
				}
				break;
		}
	}
};