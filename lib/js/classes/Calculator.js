/**
 * 计算者
 */
class Calculator {
    /**
     * 处理数据
     * @param {Number} kf 正反应速率常数 
     * @param {Number} kr 逆反应速率常数
     * @param {Object} keyDatas { kf, kr } 解构赋值 
     * @param {Object} initialDatas 初始浓度值 
     * @description initialDatas = { material: { cM1: 2 }, product: { cP1: 0 } }
     * @param {Object} configDatas 化学计量数 
     * @description configDatas = { material: [2], product:[1] }
     * @returns {Object} 摊开的对象提供给 Renderer 直接渲染 { K:5, kf: .5, kr: .1, cM1: 1, cM2: 1, cP1: 1, cP2: 2 }
     */
    process( { kf, kr }, initialDatas, configDatas ){
        // 获取反应物和生成物的名称数组 ['cM1','cM2'] ['cP1','cP2']
        const materialNames = Object.keys( initialDatas.material );
        const productNames = Object.keys( initialDatas.product );

        // 化学反应速率 v = k * ( c ** i )
        let vf = kf;
        for( let i = 0 ; i < configDatas.material.length ; i ++ ){
            vf *= initialDatas.material[materialNames[i]] ** configDatas.material[i];
        }
        let vr = kr;
        for( let i = 0 ; i < configDatas.product.length ; i ++ ){
            vr *= initialDatas.product[productNames[i]] ** configDatas.product[i];
        }
        const v = vf - vr;

        // 浓度更新 0.01 为动画时间常数
        // 复制一份浓度对象以便修改返回
        const newInitialDatas =  { ... initialDatas };
        for( let i = 0 ; i < configDatas.material.length ; i ++ ){
            // 获取反应物名称
            const name = materialNames[i];
            // 更新反应物浓度
            newInitialDatas.material[name] -= v * configDatas.material[i] * 0.01;

            // 检查负值的出现
            if( newInitialDatas.material[name] < 0 ){
                console.error('minus!');
                return 'minus!';
            }
        }
        for( let i = 0 ; i < configDatas.product.length ; i ++ ){
            // 获取生成物名称
            const name = productNames[i];
            // 更新生成物浓度
            newInitialDatas.product[name] += v * configDatas.product[i] * 0.01;

            // 检查负值的出现
            if( newInitialDatas.product[name] < 0 ){
                console.error('minus!');
                return 'minus!';
            }
        }

        // 返回 Renderer 所需要的数据
        return {
            K: kf / kr,
            kf, kr,
            ... newInitialDatas.material,
            ... newInitialDatas.product
        };
    }
}
