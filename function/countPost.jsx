const puppeteer = require('puppeteer');

const countPost = async() => {
    const chalk = await import('chalk');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let startNumber = 10000000;
    let foundPost = null;

    while (startNumber >= 6000000) {
        const url = `https://kusowanka.com/post/${startNumber}/`;
        await page.goto(url);
        
        // Получаем статус ответа
        const response = await page.waitForSelector(".main_content")

        
        if (response == null) {
            console.log(`Ошибка 500 для: ${startNumber}. Продолжаем...`);
            startNumber -= 1000000; // Уменьшаем на 1,000,000
        } else {
            // Если нашли страницу без ошибки 500, сохраняем номер
            foundPost = startNumber;
            console.log(`Найден пост на: ${foundPost}`);
            break; // Выходим из цикла, так как пост найден
        }
    }
    if (foundPost) {
        // Теперь будем искать более точно, начиная с 6,900,000
        let preciseNumber = foundPost + 90000; // Начинаем с 90,000 к числу, где нашли пост

        while (preciseNumber >= foundPost && preciseNumber <= startNumber) {
            const preciseUrl = `https://kusowanka.com/post/${preciseNumber}/`;
            await page.goto(preciseUrl);
            
            const response = await page.waitForResponse(response => response.url() === preciseUrl && (response.status() !== 500));
            
            if (response.status() === 200) {
                console.log(`Найден точный пост на: ${preciseNumber}`);
                break; // Найден конкретный пост
            }

            preciseNumber += 1000; // Увеличиваем на 1000
        }
    }

    

    const interval = setInterval(() => {
        // Очищаем консоль
        process.stdout.write('\x1Bc');

        // В зависимости от значения, выбираем цвет
        let color;
        if (value === 1) {
            color = chalk.default.green(startNumber);
        } else {
            color = chalk.default.red(startNumber); // Цвет по умолчанию для промежуточных значений
        }

        // Выводим значение
        

        // Уменьшаем значение
        if (value > 1) {
            value--;
        } else {
            clearInterval(interval); // Останавливаем интервал, когда значение достигает 1
        }
    }, 100); // Интервал обновления в миллисекундах (можно настроить)
    
    await browser.close();
    return(color);
}

module.exports = {
    countPost
}