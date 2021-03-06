/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

//浏览器兼容性处理
function addEvent(ele, event, handle) {
  if (ele.addEventListener) {//标准
    ele.addEventListener(event, handle, false)
  } else if (ele.attachEvent) {//低版本ie
      ele.attachEvent(ele, 'on'+event, handle)
  } else {//都不行的情况
    ele["on"+event] = handle;
  }
}

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;//从dat对象返回月份（0~11）
  m = m < 10 ? '0' + m : m;//m<10输出0m，否则输出m
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = '';
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    //ceil()方法返回大于或等于函数参数，并且与之最接近的整数
    //random()方法返回0~1之间的随机数
    dat.setDate(dat.getDate() + 1);//设置dat对象中的某一天
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: "北京",
  nowGraTime: 'day'
};

/**
 * 渲染图表
 */
function renderChart() {
  var chartWrap = document.getElementsByClassName('aqi-chart-wrap')[0];
  var color = '';
  var text = '';
  for (var item in chartData) {
    color = '#'+(~~(Math.random()*(1<<24))).toString(16);
    text += '<div title="'+ item + ':' + chartData[item] +'" style="height:' + chartData[item] + 'px; background-color:' + color + '"></div>';
  }
  chartWrap.innerHTML = text;
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 
  if (pageState.nowGraTime == this.value) {
    return;
  } else {
    pageState.nowGraTime = this.value;
  }
  // 设置对应数据
  initAqiChartData();
  // 调用图表渲染函数
  renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  if (this.value == pageState.nowSelectCity) {
    return;
  } else {
    pageState.nowSelectCity = this.value;
  }
  // 设置对应数据
  initAqiChartData();
  // 调用图表渲染函数
  renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var timeSelect = document.getElementById('form-gra-time');
  var pageRadio = timeSelect.getElementsByTagName('input');
  for (var i = 0; i < pageRadio.length; i++) {
    addEvent(pageRadio[i], 'click', graTimeChange);
  }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var cityList = '';
  var citySelect = document.getElementById('city-select');
  for (var item in aqiSourceData){
    cityList += '<option>'+item+'</option>';
  }
  citySelect.innerHTML = cityList;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  addEvent(citySelect, 'change', citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  var nowCityData = aqiSourceData[pageState.nowSelectCity];

  if (pageState.nowGraTime == 'day') {
    chartData = nowCityData;
  } else if (pageState.nowGraTime == 'week') {
    chartData = {};
    var countSum = 0, daySum = 0, week = 0;
    for (var item in nowCityData) {
      countSum += nowCityData[item];
      daySum ++;
      if (new Date(item).getDay() == 0) {
        week ++;
        chartData['第'+week+'周'] = Math.floor(countSum/daySum);//向下取整
        countSum = 0;
        daySum = 0;
      }
    }
    if (daySum != 0) {
        week ++;
        chartData['第'+week+'周'] = Math.floor(countSum/daySum);
    }//保证最后一周若不满也能算一周
  } else if (pageState.nowGraTime == 'month') {
    chartData = {};
    var countSum = 0, daySum = 0, month = 0;
    for (var item in nowCityData) {
      if (new Date(item).getMonth() == month) {
        countSum += nowCityData[item];
        daySum ++;
      } 
      if (new Date(item).getMonth() != month) {
        month ++;
        chartData['第'+month+'月'] = Math.floor(countSum/daySum);
        countSum = 0;
        daySum = 0;
      } 
    }
    if (daySum != 0) {
        month ++;
        chartData['第'+month+'月'] = Math.floor(countSum/daySum);
      }//保证最后一月若不满也能算一月
  }
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
  renderChart();
}

init();
