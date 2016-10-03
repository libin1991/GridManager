/**
 * Created by baukh on 16/9/3.
 * 引入requrie js ,打包时再将代码整合
 */
define(['jTool', 'checkboxGM', 'adjustGM', 'ajaxPageGM', 'baseGM', 'configGM', 'dragGM', 'exportGM', 'i18nGM','menuGM', 'orderGM', 'remindGM', 'sortGM', 'topGM'],
    function ($, CheckboxGM, AdjustGM, AjaxPageGM, BaseGM, ConfigGM, DragGM, ExportGM, I18NGM, MenuGM, OrderGM, RemindGM, SortGM, TopGM) {
    'use strict';
    // GridManager构造函数
    function GridManager(settings){
        typeof(settings) == 'undefined' ? settings = {} : '';
        this.version			= '2.0';					//版本号
        this.isDevelopMode  	= false;					//是否为开发模式，为true时将打印事件日志
        this.basePath			= '';						//当前基本路径[用于加载分页所需样式文件]
        this.useDefaultStyle	= true;						//是否使用默认的table样式
        this.supportDrag 		= true; 					//是否支持拖拽功能
        this.isRealTime			= false;					//列表内是否存在实时刷新[平时尽量不要设置为true，以免消耗资源]
        this.supportAdjust 		= true; 					//是否支持宽度调整功能]
        this.supportRemind  	= false;					//是否支持表头提示信息[需在地应的TH上增加属性remind]
        this.supportConfig		= true;						//是否支持配置列表功能[操作列是否可见]
        this.supportSetTop  	= true;						//是否支持表头置顶
        this.scrollDOM			= window;					//表头置顶所对应的容器[jquery选择器或jquery对象]
        this.topValue		  	= 0;						//特殊情况下才进行设置，在有悬浮物遮挡住表头置顶区域时进行使用，配置值为遮挡的高度
        this.animateTime    	= 300;						//动画效果时长
        this.disableCache		= false;					//是否禁用本地缓存
        this.autoLoadCss		= false;					//是否自动加载CSS文件
        //排序 sort
        this.supportSorting		= false; 					//排序：是否支持排序功能
        this.isCombSorting		= false;					//是否为组合排序[只有在支持排序的情况下生效
        this.sortData 			= {};						//存储排序数据[不对外公开参数]
        this.sortUpText			= 'up';						//排序：升序标识[该标识将会传至数据接口]
        this.sortDownText		= 'down';					//排序：降序标识[该标识将会传至数据接口]
        this.sortingBefore		= $.noop;					//排序事件发生前
        this.sortingAfter		= $.noop;					//排序事件发生后

        //分页 ajaxPag
        this.supportAjaxPage	= false;					//是否支持配置列表ajxa分页
        this.sizeData 			= [10,20,30,50,100]; 		//用于配置列表每页展示条数选择框
        this.pageSize			= 20;						//每页显示条数，如果使用缓存且存在缓存数据，那么该值将失效
        this.pageData 			= {};						//存储分页数据[不对外公开参数]
        this.query 				= {};						//其它需要带入的参数，该参数中设置的数据会在分页或排序事件中以参数形式传递
        this.pagingBefore		= $.noop;					//分页事件发生前
        this.pagingAfter		= $.noop;					//分页事件发生后
        this.pageCssFile 		= '';						//分页样式文件路径[用户自定义分页样式]

        //序号
        this.supportAutoOrder	= true;						//是否支持自动序号
        this.orderThName		= 'order';					//序号列所使用的th-name

        //选择、反选
        this.supportCheckbox	= true;						//是否支持选择与反选
        this.checkboxThName		= 'gm-checkbox';			//选择与反选列所使用的th-name
        //国际化
        this.i18n	 			= 'zh-cn';					//选择使用哪种语言，暂时支持[zh-cn:简体中文，en-us:美式英语] 默认zh-cn

        //用于支持通过数据渲染DOM
        this.columnData			= [];						//表格列数据配置项
        this.gridManagerName   	= '';						//表格grid-manager所对应的值[可在html中配置]
        this.ajax_url			= '';						//获取表格数据地址，配置该参数后，将会动态获取数据
        this.ajax_type			= 'GET';					//ajax请求类型['GET', 'POST']默认GET
        this.ajax_beforeSend	= $.noop;					//ajax请求之前,与jquery的beforeSend使用方法相同
        this.ajax_success		= $.noop;					//ajax成功后,与jquery的success使用方法相同
        this.ajax_complete		= $.noop;					//ajax完成后,与jquery的complete使用方法相同
        this.ajax_error			= $.noop;					//ajax失败后,与jquery的error使用方法相同
        this.ajax_data			= undefined;				//ajax静态数据,配置后ajax_url将无效
        this.dataKey			= 'data';					//ajax请求返回的列表数据key键值,默认为data
        this.totalsKey			= 'totals';					//ajax请求返回的数据总条数key键值,默认为totals
        //数据导出
        this.supportExport		= true;						//支持导出表格数据
        //用于支持全局属性配置  于v1.8 中将GridManagerConfig弱化且不再建议使用。

        var textConfig = {};
        if(typeof(gridManagerConfig) == 'object'){
            $.extend(true, textConfig, this.textConfig, gridManagerConfig.textConfig)
            $.extend(true, this, gridManagerConfig);
        }
        $.extend(true, textConfig, this.textConfig, settings.textConfig)
        $.extend(this, settings, {textConfig: textConfig});
    }
    // GM prototype
    GridManager.prototype = {};
    // GM导入功能: 核心
    $.extend(GridManager.prototype, BaseGM);
    // GM导入功能: 选择
    $.extend(GridManager.prototype, CheckboxGM);
    // GM导入功能: 宽度调整
    $.extend(GridManager.prototype, AdjustGM);
    // GM导入功能: 分页
    $.extend(GridManager.prototype, AjaxPageGM);
    // GM导入功能: 配置列显示隐藏
    $.extend(GridManager.prototype, ConfigGM);
    // GM导入功能: 拖拽
    $.extend(GridManager.prototype, DragGM);
    // GM导入功能: 排序
    $.extend(GridManager.prototype, SortGM);
    // GM导入功能: 导出数据
    $.extend(GridManager.prototype, ExportGM);
    // GM导入功能: 国际化
    $.extend(GridManager.prototype, I18NGM);
    // GM导入功能: 右键菜单
    $.extend(GridManager.prototype, MenuGM);
    // GM导入功能: 序号
    $.extend(GridManager.prototype, OrderGM);
    // GM导入功能: 表头提示
    $.extend(GridManager.prototype, RemindGM);
    // GM导入功能: 表头吸顶
    $.extend(GridManager.prototype, TopGM);

    // 捆绑至选择器对象
    Element.prototype.GM = Element.prototype.GridManager = function(_name_, _settings_, _callback_){

        if(this.length == 0){
            throw new Error('GridManager Error: DOM为空，请确定选择器匹配是否正确');
            return false;
        }
        var table = this;
        // 特殊情况处理：单组tr进行操作，如resetTd()方法
        if(table.nodeName === 'TR'){
            console.log('resetTd未执行');
            return;
         //   table = table.closest('table[grid-manager]');
        }
        var name,
            settings,
            callback;
        //处理参数
        //ex: $(table).GridManager()
        if(arguments.length === 0){
            name	 = 'init';
            settings = {};
            callback = undefined;
        }
        //ex: $(table).GridManager('init')
        else if(arguments.length === 1 && typeof(arguments[0]) === 'string' && typeof(arguments[0]) === 'init'){
            name	 = arguments[0];
            settings = {};
            callback = undefined;
        }
        //ex: $(table).GridManager('get')
        else if(arguments.length === 1 && typeof(arguments[0]) === 'string' && typeof(arguments[0]) !== 'init'){
            name	 = arguments[0];
            settings = undefined;
            callback = undefined;
        }
        //ex: $(table).GridManager({settings})
        else if(arguments.length === 1 && $.type(arguments[0]) === 'Object'){
            name	 = 'init';
            settings = arguments[0];
            callback = undefined;
        }
        //ex: $(table).GridManager(callback)
        else if(arguments.length === 1 && typeof(arguments[0]) === 'function'){
            name	 = 'init';
            settings = undefined;
            callback = arguments[0];
        }
        //ex: $(table).GridManager('init', callback)
        else if(arguments.length === 2 && typeof(arguments[0]) === 'string' && typeof(arguments[1]) === 'function'){
            name	 = arguments[0];
            settings = arguments[1];
            callback = undefined;
        }
        //ex: $(table).GridManager('init', {settings})
        //ex: $(table).GridManager('resetTd', false)
        //ex: $(table).GridManager('exportGridToXls', 'fileName')
        else if(arguments.length === 2 && typeof(arguments[0]) === 'string' && typeof(arguments[1]) !== 'function'){
            name	 = arguments[0];
            settings = arguments[1];
            callback = undefined;
        }
        //ex: $(table).GridManager({settings}, callback)
        else if(arguments.length === 2 && $.isPlainObject(arguments[0]) && typeof(arguments[1]) === 'function'){
            name	 = 'init';
            settings = arguments[0];
            callback = arguments[1];
        }
        //ex: $(table).GridManager('resetTd', false)
        else if(arguments.length === 2 && typeof(arguments[0]) === 'string' && typeof(arguments[1]) === 'boolean'){
            name	 = arguments[0];
            settings = arguments[1];
            callback = undefined;
        }
        //ex: $(table).GridManager('init', {settings}, callback)
        else if(arguments.length === 3){
            name	 = arguments[0];
            settings = arguments[1];
            callback = arguments[2];
        }

        //验证当前调用的方法是否为对外公开方法
        var exposedMethodList = [
            'init',					//初始化 1
            'setSort',				//手动设置排序 1
            'get',					//通过JQuery实例获取GridManager  1
            'getCheckedTr',			//获取当前选中的列 1
            'showTh',				//显示Th及对应的TD项 1
            'hideTh',				//隐藏Th及对应的TD项 1
            'exportGridToXls',		//导出表格 .xls 1
            'getLocalStorage',		//获取指定表格的本地存储数据 1
            'resetTd',				//重置列表[tbody]  1
            'setQuery',				//配置query 该参数会在分页触发后返回至pagingAfter(query)方法 1
            'refreshGrid',			//刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染 1
            'getRowData',			//获取当前行渲染时使用的数据 1
            'clear'					//清除指定表的表格记忆数据 1
        ];
        if(exposedMethodList.indexOf(name) === -1){
            throw new Error('GridManager Error:方法调用错误，请确定方法名['+ name +']是否正确');
            return false;
        }
        var gmObj;
        //当前为初始化方法
        if(name == 'init') {
            var options = $.extend({}, /*$.fn.GridManager.defaults, */settings);
            var _GM = new GridManager(options);
            _GM.init($(this), _callback_);
            return _GM;
        }
        //当前为其它方法
        else if(name != 'init'){
            var $table = table;
            gmObj = $table.data('gridManager');
            var gmData = gmObj[name]($table, settings, callback);
            //如果方法存在返回值则返回，如果没有返回jquery object用于链式操作
            return typeof(gmData) === 'undefined' ? $table : gmData;
        }

    };
});