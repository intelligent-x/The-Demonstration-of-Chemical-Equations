/**
 * 控制者
 */
class Controler {
    /**
     * 控制者
     * 存储所有操作器，调用各类操作器行使主要逻辑
     * @param {object} calculator 计算者
     * @param {object} transporter 传输者
     * @param {object} renderer 渲染者 0.01s 一次
     * @param {object} configer 模式者
     */
    constructor({ calculator, transporter, renderer, configer }) {
        // 存储操作器
        this.calculator = calculator;
        this.transporter = transporter;
        this.renderer = renderer;
        this.configer = configer;
        this.mainButtons = {
            start: document.querySelector('.main-start'),
            end: document.querySelector('.main-end'),
            reset: document.querySelector('.main-reset'),
            configOpen: document.querySelector('.config-button-container')
        }
        this.configButtons = {
            submit: document.querySelector('.config-save'),
            reset: document.querySelector('.config-reset'),
            close: document.querySelector('.config-close')
        }

        // 初始化事件
        this.initEvent();
    }

    /**
     * 初始化事件：监听所有按钮点击事件
     * initEvent 封装初始化全部事件
     * initMainEvent 初始化 main-page 内的按钮点击事件
     * initConfigEvent 初始化 config-page 内的按钮点击事件
     */
    initEvent(){
        this.initMainEvent();
        this.initConfigEvent();
    }
    initMainEvent(){
        this.mainButtons.start.addEventListener('click',(e)=>{
            this.start();
        });
        this.mainButtons.end.addEventListener('click',(e)=>{
            this.end();
        });
        this.mainButtons.reset.addEventListener('click',(e)=>{
            this.end();
            this.clear();
        });
        this.mainButtons.configOpen.addEventListener('click',(e)=>{
            // 先结束应用，清除信息
            this.end();
            this.clear();
            // 在开启模式选择器
            this.openConfiger();
        });
    }
    initConfigEvent(){
        this.configButtons.submit.addEventListener('click', (e)=>{
            this.configer.saveData();
        });

        this.configButtons.reset.addEventListener('click', (e)=>{
            this.configer.clear();
        });

        this.configButtons.close.addEventListener('click',(e)=>{
            // 关闭配置界面
            this.renderer.closeConfigPage();
            // 调整主界面(输入框,条形图,标题)
            this.renderer.adjust( this.configer.datas );
        })
    }

    /**
     * 开启配置选择器
     */
    openConfiger(){
        // 渲染模式选择界面
        this.renderer.openConfigPage();
        this.configer.reload();
    }

    /**
     * 每次循环内要做的事情
     */
    eventLoop(){
        const initData = this.transporter.getInput();
        
        const renderDatas = this.calculator.process( 
            initData.keyDatas, 
            initData.initialDatas, 
            this.configer.datas
        );

        this.renderer.process( renderDatas );
    }

    /**
     * 开启应用
     */
    start(){
        const that = this;
        this.timer = setInterval(function(){
            that.eventLoop();
        }, 10);
    }

    /**
     * 结束应用
     */
    end(){
        // clearInterval 一定要局部作用域才能清除
        const timer = this.timer;
        clearInterval( timer );
    }

    /**
     * 清除数据
     */
    clear(){
        const initData = this.transporter.getInput();
        const finalData = {};
        for( const item in initData ){
            finalData[item] = 0;
        }
        this.renderer.process(finalData);
    }
}
