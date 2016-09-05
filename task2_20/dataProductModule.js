//数据产生
function Data_product(data_box) {
	this.box = data_box;
	this.id = 0;
}
Data_product.prototype = {
	init: function () {
		//根据类型的选中来展示相应的表单
		addEvent($('create'), 'change', this.showTable.bind(this));
	
	},
	showTable: function (e) {
		if (e.target.getAttribute('type') == 'radio') {
			//根据选中的radio改变对应的className
			e.target.parentNode.className = e.target.id;
			if (!/necessary/.test(e.target.id))
				//同步输入框中名字的设置
				this.box.box_label.box.value = e.target.nextElementSibling.innerHTML;
		}
	},
	//设置表单的信息获取的逻辑
	getData: function () {
		//初始化表单
		var data = {
			label: '',			//标签名字
			type: '',			//表单类型
			necessary: true,	//是否必填
			input_type: '',		//input表单的种类
			item: [],			//radio的选项
			min_length: 0,		//text之类文本的最小长度限制
			max_length: 1,		//text之类文本的最大长度限制
			id: 0				//表单的id,初始值为0
		};
		//配置表单的必须数据
		data = this.getBaseData(data);
		//根据type配置对应的数据
		switch(data.type) {
			case 'input':
				switch(data.input_type) {
					case 'text':
					case 'password':
						data = this.getLengthRelativeData(data);
						break
				}
				break;
			case 'radio':
			case 'checkbox':
			case 'select':
				data = this.getSpecialInputRelativeData(data);
				break;
			case 'textarea':
				data = this.getLengthRelativeData(data);
				break;
		}
		return data;
	},
	//配置表单的必须数据
	getBaseData: function (data) {
		data.label = this.getText(this.box.box_label);
		data.type = this.getText(this.box.box_type);
		data.necessary = this.getText(this.box.box_basic) == 'necessary';
		data.input_type = this.getText(this.box.box_input_type);
		data.id = 'form'+this.id++;
		return data;
	},
	//通过data_box的box对象值，来获取对应node的某个属性值
	getText: function (data_box) {
		return data_box.box[data_box.value];
	},
	//配置text password和textarea的信息
	getLengthRelativeData: function (data) {
		data.min_length = this.getText(this.box.box_min_length);
		data.max_length = this.getText(this.box.box_max_length);
		return data;
	},
	//配置radio select checkbox的信息
	getSpecialInputRelativeData: function (data) {
		var items = this.box.box_item[1];
		data.item = [];//清空之前的item
		for (var i = 0; i < items.length; i++) {
			data.item.push(items[i].innerHTML);
		}
		if (data.item.length == 0) {
			alert('你还没有添加'+data.label+'的选项');
			data = null;
		} else if (data.item.length == 1) {
			alert('你只添加了一个选项，无法创建'+data.label);
			data = null;
		}
		return data;
	},
	//添加表单
	addForm: function (data) {
		switch(data.type) {
			case 'input':
				this.addTextForm(data);
				break;
			case 'radio':
				this.addRadioForm(data);
				break;
			case 'checkbox':
				this.addCheckboxForm(data);
				break;
			case 'select':
				this.addSelectForm(data);
				break;
			case 'textarea':
				this.addTextareaForm(data);
				break;
		}
	},
	//根据data在结果表单中显示相应的表单
	//添加text表单
	addTextForm: function (data) {
		var box = document.createElement('div');
		box.innerHTML = '<label>' + data.label + '</label><input type="' + data.input_type + '" id="' + data.id + '"><span></span>';
		this.box.result_box.insertBefore(box, this.box.submit);
	},
	//添加radio表单
	addRadioForm: function (data) {
		var box = document.createElement('div');
		var text = '';
		box.className = 'radio_box';
		text += '<div id="' + data.id +'"><label class="formNameLabel">' + data.label +'</label>';
		for (var i = 0; i < data.item.length; i++) {
			text += '<input type="radio" name="'+ data.id +'"><label>' + data.item[i] + '</label>';
		}
		text += '</div><span></span>';
		box.innerHTML = text;
		this.box.result_box.insertBefore(box, this.box.submit);
	},
	//添加checkbox表单
	addCheckboxForm: function (data) {
		var box = document.createElement('div');
		var text = '';
		box.className = 'radio_box';
		text += '<div id="' + data.id +'"><label class="formNameLabel">' + data.label +'</label>';
		for (var i = 0; i < data.item.length; i++) {
			text += '<input type="checkbox" name="'+ data.id +'"><label>' + data.item[i] + '</label>';
		}
		text += '</div><span></span>';
		box.innerHTML = text;
		this.box.result_box.insertBefore(box, this.box.submit);
	},
	//添加select表单
	addSelectForm: function (data) {
		var box = document.createElement('div');
		var text = '';
		text += '<label>' + data.label +'</label><select id="' + data.id +'">';
		for (var i = 0; i < data.item.length; i++) {
			text += '<option>' + data.item[i] + '</option>';
		}
		text += '</select><span></span>';
		box.innerHTML = text;
		this.box.result_box.insertBefore(box, this.box.submit);
	},
	//添加textarea表单
	addTextareaForm: function (data) {
		var box = document.createElement('div');
		box.innerHTML = '<label>' + data.label + '</label><textarea id="' + data.id + '"></textarea><span></span>';
		this.box.result_box.insertBefore(box, this.box.submit);
	}
}