const assignObjectNotNullToBaseObject = (base,assign)=>  {
    for(let item in assign){
        if(assign[item]){
            base[item] = assign[item]
        }
    }
}


module.exports ={
    assignObjectNotNullToBaseObject
}