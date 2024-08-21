/**
 * 渲染者 
 */
class Renderer {
    // 存储元素 主界面输入框容器 主界面数据标签容器 主界面图表容器
    mainInputContainer = document.querySelector('.main-page .main .input');
    mainDataContainer = document.querySelector('.main-page .main .output .data');
    mainChartContainer = document.querySelector('.main-page .main .output .chart');

    // 图标横坐标的最大值
    chartRangeMax = 10
    
    /**
     * 构造函数 初始化事件
     */
    constructor(){
        this.initEvent();
        this.mainChartContainer.setAttribute( 'title', this.chartRangeMax );
    }

    /**
     * 监听图标容器的点击事件: 输入更改图标显示上限
     */
    initEvent(){
        this.mainChartContainer.addEventListener('click', (e)=>{
            const chartRangeMax = + prompt('请输入图标的显示上限值: ');
            // 默认为 10
            this.chartRangeMax = chartRangeMax === 0 ? 10 : chartRangeMax;
            this.mainChartContainer.setAttribute( 'title', this.chartRangeMax );
        });
    }

    /**
     * 封装调节方法 根据 Configer 的配置情况调节主界面的输入框 图表 标题
     * @param {arr} datas {material:[], product:[]}
     */
    adjust( datas ){
        this.adjustInputItems( datas );
        this.adjustChartItems( datas );
        this.adjustHeader( datas );
    }

    /**
     * 调节输入区输入框个数
     * @param {Object} datas Configer 传入用户输入的数据 {material:[], product:[]}
     */
    adjustInputItems( datas ){
        // 覆盖必填数据
        this.mainInputContainer.innerHTML = `
        <div class="input-item">
            <div class="label">
                <span>K</span>
            </div>
            <input type="text" id="K" disabled>
        </div>
        <div class="input-item">
            <div class="label">
                <span>
                    k<sub>正</sub>
                </span>
            </div>
            <input type="text" id="kf">
        </div>
        <div class="input-item">
            <div class="label">
                <span>
                    k<sub>逆</sub>
                </span>
            </div>
            <input type="text" id="kr">
        </div>
        `;

        // 用户添加的数据
        // 反应物
        for( let i = 0; i < datas.material.length ; i ++ ){
            this.mainInputContainer.appendChild(
                this.createInputItem(`M${i+1}`)
            );
        }
        // 生成物
        for( let i = 0 ; i < datas.product.length ; i ++ ){
            this.mainInputContainer.append(
                this.createInputItem(`P${i+1}`)
            );
        }
    }
    
    /**
     * 调节输出区标签,柱形图个数
     * 
     */
    adjustChartItems( datas ){
        // 覆盖标签
        this.mainDataContainer.innerHTML = '';

        // 覆盖图标添加原有网络线
        this.mainChartContainer.innerHTML = `
            <div class="net">
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
            </div>
        `;

        // 反应物
        for( let i = 0; i < datas.material.length ; i ++ ){
            this.mainDataContainer.appendChild(
                this.createDataItem(`M${i+1}`)
            );
            this.mainChartContainer.appendChild(
                this.createChartItem(`M${i+1}`)
            );
        }
        // 生成物
        for( let i = 0 ; i < datas.product.length ; i ++ ){
            this.mainDataContainer.append(
                this.createDataItem(`P${i+1}`)
            );
            this.mainChartContainer.appendChild(
                this.createChartItem(`P${i+1}`)
            );
        }

    }

    /**
     * 调节标题
     * @param {Object} data Configer 传入用户输入的数据 {material:[], product:[]}
     */
    adjustHeader({ material, product }){
        const materialArr = material.map((cur,idx,arr)=>{
            return `${cur}M<sub>${idx+1}</sub>(g)`;
        });
        const productArr = product.map((cur,idx,arr)=>{
            return `${cur}P<sub>${idx+1}</sub>(g)`;
        });
        const title = `${materialArr.join('+')} <=> ${productArr.join('+')}`;
        document.querySelector('.reaction-equation span').innerHTML = title;
    }

    /**
     * 创建一个带有 name 的 input 组件并返回
     * @param {String} name 对应的反应物或生成物名称 
     * 
     * @description inputItem 模板
     * <div class="input-item">
            <div class="label">
                <span>
                    c<sub>M1</sub>
                </span>
            </div>
            <input type="text" id="cM1">
        </div>
     */
    createInputItem( name ){
        this.counter ++;
        // 创建元素
        const inputItem = document.createElement('div');
        const label = document.createElement('div');
        const span = document.createElement('span');
        const input = document.createElement('input');

        // 调节参数
        inputItem.classList.add('input-item');
        label.classList.add('label');
        span.innerHTML = `c<sub>${name}</sub>`;
        input.setAttribute('id', `c${name}`);
        input.setAttribute('type', 'text');

        // 加入节点
        label.appendChild( span );
        inputItem.appendChild( label );
        inputItem.appendChild( input );
    
        return inputItem;
    }

    /**
     * @param {String} name 反应物或生成物的名称 
     * @description 模板
     * <div class="data-item" id="cM1">
           <span>c<sub>M1</sub></span>
       </div>
     */
    createDataItem( name ){
        // 创建元素
        const dataItem = document.createElement('div');
        const span = document.createElement('span');

        // 设置属性
        dataItem.classList.add('data-item');
        dataItem.setAttribute('id', `c${name}`);
        span.innerHTML = `c<sub>${name}</sub>`;

        // 添加节点
        dataItem.appendChild( span );

        return dataItem;
    }

    /**
     * @param {String} name 反应物或生成物的名称 
     * @description 模板
     * <div class="chart-item" id="chart-cA0"></div>
     */
    createChartItem( name ){
        // 创建元素
        const chartItem = document.createElement('div');

        // 设置属性
        chartItem.classList.add('chart-item');
        chartItem.setAttribute('id', `chart-c${name}`);

        return chartItem;
    }

    /**
     * 渲染数据变化
     * @param {arr} finalData 传入的最终的数据 
     */
    process( finalData ){
        [...this.mainInputContainer.querySelectorAll('input')]
        .forEach((cur,idx,arr)=>{
            cur.value = finalData[cur.id];
        });
        [...this.mainChartContainer.querySelectorAll('.chart-item')]
        .forEach((cur,idx,arr)=>{
            cur.style.width = `${ finalData[cur.id.replace('chart-','')] / this.chartRangeMax * 100 }%`;
        });
    }

    /**
     * 打开 config 界面
     */
    openConfigPage(){
        document.querySelector('.config-page').classList.toggle('config-page-close');
    }

    /**
     * 关闭 config 界面
     */
    closeConfigPage(){
        document.querySelector('.config-page').classList.toggle('config-page-close');
    }
}
