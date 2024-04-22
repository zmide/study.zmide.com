// 处理文件数据
export const parseIrregularityData = (data:Array<Array<string>>)=>{
    let id = 1;
    const newdata =  data.filter(item => {
        return item.length !== 0;
    }).map(item => {
        return Array.from(item)
    }).map(item => {
        return item.map(item => {
            if (item === null || item === undefined || item === 'empty') {  
                return ''; // 如果元素是 null、undefined 或 'empty'，返回空字符串  
              }  
            return item; // 否则返回原元素  
        })
    }).map(item => {
        return {
            ...item
        }
    }).map(item  => {
        return {
            id:id++,
            ...item
        }
    })    
    return  newdata
}

