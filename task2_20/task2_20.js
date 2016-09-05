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

function $(id) {
	return document.getElementById(id);
}
//存放需要用的id节点
var data_box = {
	box_style: {
		box: $('select_box')
	},
	box_type: {
		box: $('box_type'), //表单类型
		value: 'className'
	},
	box_label: {
		box: $('box_label'), //label名称
		value: 'value'
	},
	box_basic: {
		box: $('box_basic'), //是否必填
		value: 'className'
	},
	box_input_type: {
		box: $('rule_input'), //input类型的规则（邮箱，号码，数字，文本，密码）
		value: 'className'
	},
	box_item: [
		$('box_item_container'),
		document.getElementsByClassName('item')
	],
	box_min_length: {
		box: $('min_length'), //有长度限制的最小长度
		value: 'value'
	},
	box_max_length: {
		box: $('max_length'), //有长度限制的最大长度
		value: 'value'
	},
	add_btn: $('add_btn'), //添加展示表单的按钮
	result_box: $('result'), //表单的展示区域
	submit: $('submit') //提交展示表单的按钮
};

var data_product = new Data_product(data_box);
var formArr = [];
data_product.init();

//绑定点击事件，点击添加按钮之后，返回表单的数据
addEvent(data_product.box.add_btn, 'click', function () {
	var data = data_product.getData();
	if (data != null) {
		//在form中添加相应的表单
		data_product.addForm(data);
		//存放表单并且将表单绑定到Form中，绑定验证函数
		formArr.push(new Form(data));
	}
});

//提交表单按钮绑定点击事件
//点击之后判断是否都满足要求，如果没有，给出验证
addEvent(data_product.box.submit, 'click', function () {
	var text = '';
    for (var i = 0; i < formArr.length; i++) {
    	if (formArr[i].data.necessary) {
        	text += !formArr[i].validate() ? formArr[i].tip.textContent + '\n' : '';
        }
    }
    text == '' ? alert('提交成功') : alert(text);
})