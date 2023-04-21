const collection = require("C:/Users/yagan/Desktop/Политех/4сем/WEB/5laba/configs/dbConn")



async function printAll() {
        let mas =await collection.find({}).toArray();
        return mas;
}
async function printById(key) {
    
        
    let mas;
    mas =await collection.findOne({name: key});
    console.log(mas);
    return mas;
    
    
    // взаимодействие с базой данных

}
async function Insert(body) {
    
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate);
    let mas;
    body.date = formattedDate;
   
    await collection.insertOne(body);
    
    return mas;
    
    
    // взаимодействие с базой данных

}


module.exports={
    printAll,
    printById,
    Insert
}