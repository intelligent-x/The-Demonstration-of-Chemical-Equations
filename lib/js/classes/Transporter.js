/**
 * 传输者
 */
class Transporter {
    // 存储输入 DOM

    /**
     * 获取用户输入的信息
     * 格式 { keyDatas: {}, initialDatas: { material: {}, product: {} } }
     */
    getInput(){
        const finalObject = [...document.querySelectorAll('.main-page .input input')]
        .reduce((temp,cur,idx,arr)=>{
            // 如果是平衡常数那一项直接跳过
            if( cur.id === 'K' ) 
                return temp;

            // 把没有任何输入看作 0 并将字符串变成数字
            const value = cur.value === '' ? 0 : +cur.value;
            
            // 若输入非数字返回错误
            if( Number.isNaN( +value ) ){
                console.error('User just input NaN!'); 
                return 'error';
            } 
            
            // 写入数据
            if( idx <= 2 ) temp.keyDatas[cur.id] = value;
            // search 如果有子字符串，那么返回 1；否则返回 -1
            else if( cur.getAttribute('id').search('M') === 1 ) 
                temp.initialDatas.material[cur.id] = value;
            else temp.initialDatas.product[cur.id] = value;
            
            return temp;
        },{ keyDatas: {}, initialDatas: { material: {}, product: {} } });

        return finalObject;
    }

    // 向操作器发送信息
    post(){

    }
}
