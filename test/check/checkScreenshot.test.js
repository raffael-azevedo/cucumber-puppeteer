const checkScreenshot = require('../../features/support/check/checkScreenshot');
const fs = require('fs');
const openUrl = require('../../features/support/action/openUrl');
const BrowserScope = require('../../features/support/scope/BrowserScope');

const testUrl = 'http://localhost:8080/checkScreenshot.html';
const browserScope = new BrowserScope();
const deleteImage = (path) => {
  if(fs.existsSync(path)){
    fs.unlinkSync(path);
  }
};

beforeAll(async () => {
  await browserScope.init();
  await openUrl.call(browserScope, testUrl);
});
afterAll(async () => {
  await browserScope.close();

  // Delete screenshots from the test run
  const environment = process.env.ENV ? `-${process.env.ENV}` : '';
  deleteImage(`./test/screenshots/compare/missing${environment}.png`);
  deleteImage(`./test/screenshots/ref/missing${environment}.png`);
});

describe('checkScreenshot', () => {

  it('finds matching screenshots', async () => {   
    await checkScreenshot.call(browserScope, 'ccc-landing', './test/screenshots');
  });
  
  it('fails if the screenshot does not exist', async () => {  
    await expect(checkScreenshot.call(browserScope, 'missing', './test/screenshots')).rejects.toThrow('Expected reference screenshot to exist');
  });

  it('fails if the screenshot does not match', async () => {    
    await expect(checkScreenshot.call(browserScope, 'ccc-landing-mismatch', './test/screenshots')).rejects.toThrow('Expected screenshots to match.');
  });

  it('fails if the screenshots are not the same size', async () => {    
    await expect(checkScreenshot.call(browserScope, 'ccc-landing-wrong-size', './test/screenshots')).rejects.toThrow('Expected screenshot widths to match.');
  }); 

}); 