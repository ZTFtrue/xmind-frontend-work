# XmindFrontend

[作业地址](https://github.com/xmindltd/hiring/tree/master/frontend-1)

[点击预览, 支持手机和电脑](https://ztftrue.github.io/xmind-frontend-work/)

## 如何运行

__运行环境:__ 不限操作系统, 需要安装Node.js和npm.

### 运行和测试

```sh
npm i
npm run start
```

在浏览器中打开[http://localhost:4200/](http://localhost:4200/)

_目前firefox输入时间存在bug [https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)_(正在使用 Custom datetimepicker 代替)

代码目录: ```./src/``` , 其中 ```./src/app/``` 是项目主要代码, ```./src/assets/```是资源存放目录.

如果需要单元测试, 运行```npm run test```

**注意:** 如果是**第一次安装 Angular** 中间会有个选择过程

### 我的测试环境

1. Linux : Chrome, Firefox (无法输入时间和日期, 浏览器Bug )
2. Window : Chrome, Firefox (无法输入时间和日期, 浏览器Bug )
3. Android : Chrome, Firefox ( Android 版 Firefox 可以输入时间和日期 )

## 思考过程和问题

### 分析需求

1. csv加载和展示, 将csv转化成ts可用的对象, 为了避免使用自建服务器,将CSV文件放置到assets中.

2. 筛选: 数组过滤, 页面上需要添加 select 控件

3. 支持使用者添加账单: 使用form表单

4. 统记:依然是操作数组, 基本同2

5. 二次筛选: 依然和2一样

6. 统记和排序:基本同4

总结: 其中2和5 , 4和6可以视为同一个, 分别放到一块做.

基本流程:
展示数据->筛选数据->统计和排序->添加数据

因为对 Angular 熟悉, 所以选择 Angular 开发.

### 开发及问题

解析CSV是我在很早之前就做过的, 一般有两种方法: 一种是循环分析, 一种是通过正则解析, 正则解析的数据在此依然需要循环分析以方便使用.

展示时间使用Angular date pipe, 按照示例格式化时间 (根据[wikipedia](https://zh.wikipedia.org/wiki/ISO_8601), 即使是ISO 8601也不完全一致) .

添加数据时发现我在开始做过滤的时候,看到数据是同一年, 只添加了月份,和账单类型和账单分类的过滤. 如果用户添加不同的年, 需要加上年份过滤. 账单分类用户可以自由输入,又加上了```mat-autocomplete```和```categroiesFilterData``` 数组, 以便对用户进行友好的提示.对select 控件重新处理, 以便自动选择年,和有多个年的时候,禁止选择月份.

最后补上需求, 没有选择月份的时候, 不进行统计. 集中进行CSS开发, 兼容手机和电脑 (就是不怎么好看)

## 未定问题

如果允许用户自定义账单分类, 则账单分类和账单类型可能会冲突, 即同样的名词一个是收入,一个是支出.虽然可以同时加两个字段, 但是工作量会太多, 所以我选择把账单类型的优先级降低. 也可以选择只加一个, 当用户再添加同名分类的时候不允许修改类型.

如果不允许用户自定义账单分类,则需要对此项目进行少许修改.

二级分类指的是哪一级分类? 是否有关联, 即选择一个另外一个是否变化?更换年和月的时候, 是否清空其它选项?
