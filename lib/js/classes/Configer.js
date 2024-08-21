/**
 * 模式者 选择方程式的相关配置
 */
class Configer {
    /**
     * 计数器
     */
    counter = 0
    datas = {
        material: [],
        product: []
    }

    /**
     * 构造函数
     * @param {Node} materialNumber 反应物数量
     * @param {Node} productNumber 生成物数量
     * @param {Node} materialContainer 反应物系数输入框容器
     * @param {Node} productContainer 生成物系数输入框容器
     */
    constructor( 
        [ materialNumber, productNumber ], 
        [ materialContainer, productContainer ]
    ){
        // 存储数据
        this.storeElements = {
            material: {
                number: materialNumber,
                container: materialContainer
            },
            product: {
                number: productNumber,
                container: productContainer
            }
        }

        // 初始化事件
        this.initEvent( materialNumber, productNumber, materialContainer, productContainer );
    }

    /**
     * 初始化事件: 监听反应物与生成物数量输入框的输入事件，并实时调整系数输入框个数
     * @param {Node} materialNumber 反应物数量
     * @param {Node} productNumber 生成物数量
     * @param {Node} materialContainer 反应物容器 
     * @param {Node} productContainer 生成物容器 
     */
    initEvent( materialNumber, productNumber, materialContainer, productContainer ){        
        materialNumber.addEventListener('input',(e)=>{
            this.adjustInputs( e.target.value, materialContainer, 'M' );
        });

        productNumber.addEventListener('input',(e)=>{
            this.adjustInputs( e.target.value, productContainer, 'P' );
        });
    }

    /**
     * 调节输入框个数
     * @param {Number} number 输入的数字 
     * @param {Node} container 对应的容器
     * @param {String} tag 对应的标签
     */
    adjustInputs( number, container, tag ){
        // 先覆盖清空
        container.innerHTML = '';
    
        // 再加入元素
        for( let i = 0 ; i < number ; i ++ ){
            container.appendChild( this.createInput( tag ) );
        }

        // 添加完毕，计数器清零，便于下次添加的元素的 id 从 1 开始
        this.counter = 0;
    }

    /**
     * 创建一个带有 tag 的 input 组件并返回
     * @param {String} tag 对应的标签 
     * 
     * @description inputItem 模板 
     * <div class="input-item">
            <div class="label">
                <span>
                    A<sub>1</sub>
                </span>
            </div>
            <input type="text" id="kr">
        </div>
     */
    createInput( tag ){
        this.counter ++;
        // 创建元素
        const fragument = document.createDocumentFragment();
        const inputItem = document.createElement('div');
        const label = document.createElement('div');
        const span = document.createElement('span');
        const input = document.createElement('input');

        // 调节参数
        inputItem.classList.add('input-item');
        label.classList.add('label');
        span.innerHTML = `${tag}<sub>${this.counter}</sub><br>系数`;
        input.setAttribute('id', `${tag}${this.counter}`);
        input.setAttribute('type', 'text');

        // 加入节点
        label.appendChild( span );
        inputItem.appendChild( label );
        inputItem.appendChild( input );
 
        return inputItem;
    }

    /**
     * 重新加载(刷新)
     */
    reload(){
        // 清空计数器
        this.counter = 0;

        // 重载数据输入框
        this.storeElements.material.number.value = this.datas.material.length;
        this.storeElements.product.number.value = this.datas.product.length;

        this.adjustInputs( this.datas.material.length, this.storeElements.material.container, 'M' );
        this.adjustInputs( this.datas.product.length, this.storeElements.product.container, 'P' );

        // 重载系数输入框
        this.storeElements.material.container.querySelectorAll('input').forEach((cur,idx,arr)=>{
            cur.value = this.datas.material[idx];
        });
        this.storeElements.product.container.querySelectorAll('input').forEach((cur,idx,arr)=>{
            cur.value = this.datas.product[idx];
        });

    }

    /**
     * 重置
     */
    clear(){
        // 清空计数器
        this.counter = 0;

        // 清空系数输入框
        this.storeElements.material.container.innerHTML = '';
        this.storeElements.product.container.innerHTML = '';

        // 清空数据输入框
        this.storeElements.material.number.value = 0;
        this.storeElements.product.number.value = 0;
    }

    /**
     * 保存用户输入的数据
     */
    saveData(){
        this.datas.material = [...this.storeElements.material.container.querySelectorAll('input')].map( cur => +cur.value );
        this.datas.product = [...this.storeElements.product.container.querySelectorAll('input')].map( cur => +cur.value );
    }
}
