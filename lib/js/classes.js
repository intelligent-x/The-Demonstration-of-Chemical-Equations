/**
 * 计算者
 */
class Calculator {
    process({ K, kf, kr, cA0, cB0, cC0, cD0 }){
        // 化学计量数
        const a = 1;
        const b = 1;
        const c = 1;
        const d = 1;

        const vf = kf * ( cA0 ** a )* ( cB0 ** b );
        const vr = kr * ( cC0 ** c )* ( cD0 ** d );
        const v = vf - vr;

        const cA = cA0 - v * a * 0.01;
        const cB = cB0 - v * b * 0.01;
        const cC = cC0 + v * c * 0.01;
        const cD = cD0 + v * d * 0.01;

        const finalData = {
            K: kf / kr,
            kf, kr,
            cA0: cA, 
            cB0: cB, 
            cC0: cC, 
            cD0: cD
        };
        
        // 检查负值的出现
        for( const item in finalData ){
            if( finalData[item] < 0 ){
                console.error('minus!');
                return 'minus!';
            }
        }

        return finalData;
    }
}

/**
 * 传输者
 */
class Transporter {
    // 存储输入 DOM
    mainInputs = [...document.querySelectorAll('input')];

    /**
     * 获取用户输入的信息
     * 格式 { id: value, id: value, ... }
     */
    getInput(){
        return this.mainInputs.reduce((temp,cur,idx,arr)=>{
            // 如果是平衡常数那一项直接跳过
            if( cur.id === 'K' ) 
                return temp;

            // 把没有任何输入看作 0
            const value = cur.value === '' ? 0 : +cur.value;
            
            // 若输入非数字返回错误
            if( Number.isNaN( +value ) ){
                console.error('User just input NaN!'); 
                return 'error';
            } 
            
            // 将字符串变成数字
            temp[cur.id] = value;
            return temp;
        },{});
    }

    // 向操作器发送信息
    post(){

    }
}

/**
 * 渲染者 
 */
class Renderer {
    dataItems = document.querySelectorAll('input');
    chartItems = document.querySelectorAll('.chart-item');

    process( finalData ){
        this.dataItems.forEach((cur,idx,arr)=>{
            cur.value = finalData[cur.id];
        });
        this.chartItems.forEach((cur,idx,arr)=>{
            cur.style.width = `${ finalData[cur.id.replace('chart-','')] / 10 * 90 }%`;
        });
    }

    /**
     * 展示 modeConfig 界面
     */
    showModeConfig(){

    }
}

/**
 * 模式者 选择方程式的相关配置
 */
class Moder {
    
}

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
     * @param {object} moder 模式者
     */
    constructor({ calculator, transporter, renderer, moder }) {
        // 存储操作器
        this.calculator = calculator;
        this.transporter = transporter;
        this.renderer = renderer;
        this.buttons = {
            start: document.querySelector('.start'),
            end: document.querySelector('.end'),
            reset: document.querySelector('.reset'),
            moder: document.querySelector('.mode-container')
        }

        // 初始化事件
        this.initEvent();
    }

    /**
     * 初始化事件：开始业务逻辑
     */
    initEvent(){
        this.buttons.start.addEventListener('click',(e)=>{
            this.start();
        });
        this.buttons.end.addEventListener('click',(e)=>{
            this.end();
        });
        this.buttons.reset.addEventListener('click',(e)=>{
            this.end();
            this.clear();
        });
        this.buttons.moder.addEventListener('click',(e)=>{
            // 先结束应用，清除信息
            this.end();
            this.clear();
            // 在开启模式选择器
            this.openModeConfig();
        });
    }

    /**
     * 开启模式选择器
     */
    openModeConfig(){
        // 渲染模式选择界面
        this.renderer.showModeConfig();
    }

    /**
     * 每次循环内要做的事情
     */
    eventLoop(){
        const initData = this.transporter.getInput();
        const finalData = this.calculator.process( initData );
        this.renderer.process( finalData );
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
