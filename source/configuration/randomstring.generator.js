//this is used basically to generate a random string so that it can be exceptional in case any of the name or directory match
const genRanStr=(len=101)=>{
    const chars="0123456789_-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const length=chars.length
    let randomStr=""
    for(let i=1;i<len;i++){
        const position=Math.ceil(Math.random()*(length-1))
        randomStr+=chars[position]
    }
    return randomStr
}
module.exports={genRanStr}