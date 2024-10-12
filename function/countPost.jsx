const puppeteer = require('puppeteer');

(async () => {
    const chalk = await import('chalk');

    let value = 100;

    const interval = setInterval(() => {
        // Очищаем консоль
        process.stdout.write('\x1Bc');

        // В зависимости от значения, выбираем цвет
        let color;
        if (value === 100) {
            color = chalk.default.red(value);
        } else if (value === 1) {
            color = chalk.default.green(value);
        } else {
            color = chalk.default.red(value); // Цвет по умолчанию для промежуточных значений
        }

        // Выводим значение
        console.log(color);

        // Уменьшаем значение
        if (value > 1) {
            value--;
        } else {
            clearInterval(interval); // Останавливаем интервал, когда значение достигает 1
        }
    }, 100); // Интервал обновления в миллисекундах (можно настроить)
})();



(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let startNumber = 10000000;
    let foundPost = null;

    while (startNumber >= 6000000) {
        const url = `http://localhost/post/${startNumber}`;
        await page.goto(url);
        
        // Получаем статус ответа
        const response = await page.waitForResponse(response => response.url() === url && response.status() === 500);
        
        if (response.status() === 500) {
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
            const preciseUrl = `http://localhost/post/${preciseNumber}`;
            await page.goto(preciseUrl);
            
            const response = await page.waitForResponse(response => response.url() === preciseUrl && (response.status() !== 500));
            
            if (response.status() === 200) {
                console.log(`Найден точный пост на: ${preciseNumber}`);
                break; // Найден конкретный пост
            }

            preciseNumber += 1000; // Увеличиваем на 1000
        }
    }

    await browser.close();
})();
