const puppeteer = require('puppeteer');

async function readWebPageContent(url) {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(url);

    const result = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('*'));
        const contentSet = new Set();

        elements.forEach(element => {
            const text = (element.innerText || '').trim();
            const imageSrc = element.tagName === 'IMG' ? element.src : null;
            const item = { text, imageSrc };
            contentSet.add(JSON.stringify(item));
        });

        const content = Array.from(contentSet).map(itemString => JSON.parse(itemString));

        const imageUrls = Array.from(document.querySelectorAll('img')).map(img => img.src);

        return { content, imageUrls };
    });

    await browser.close();
    return result;
}

const url = 'https://www.example.com';
readWebPageContent(url).then(({ content, imageUrls }) => {
    console.log('Text Content:');
    content.forEach(({ text, imageSrc }) => {
        console.log('  Text:', text);
        if (imageSrc) {
            console.log('  Image Source:', imageSrc);
        }
    });

    console.log('\nImage URLs:', imageUrls);
});
