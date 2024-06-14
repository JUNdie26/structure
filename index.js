const Database = require('./database');

async function main() {
    const db = new Database();


    await new Promise(resolve => setTimeout(resolve, 2000));

    await db.put('name', 'JangHyeonJong');
    await db.put('age', '19');
    console.log("Name:", await db.get('name'));
    console.log("Age:", await db.get('age'));
}

main();
