import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport for high-resolution capture
  await page.setViewportSize({ width: 1920, height: 1200 });
  
  // Navigate to the page
  await page.goto('https://3000-if2gbw7zxhkci19nlc6gp-b15ec820.sg1.manus.computer', {
    waitUntil: 'networkidle'
  });
  
  // Wait for hero section to load
  await page.waitForSelector('h1');
  
  // Get the hero section element
  const heroSection = await page.locator('section').first();
  
  // Capture as PNG with 2x scale for high resolution
  await heroSection.screenshot({
    path: '/tmp/spot_hero_ultra_hd.png',
    scale: 'css'
  });
  
  console.log('✅ PNG saved: /tmp/spot_hero_ultra_hd.png');
  
  // Capture as PDF
  await page.pdf({
    path: '/tmp/spot_hero_ultra_hd.pdf',
    width: '1920px',
    height: '1200px',
    scale: 1.5
  });
  
  console.log('✅ PDF saved: /tmp/spot_hero_ultra_hd.pdf');
  
  await browser.close();
})().catch(console.error);
