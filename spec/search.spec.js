const puppeteer = require("puppeteer");

let page;
let browser;
const searchBox = ".gLFyf.gsfi";
let originalTimeout;

describe("google search", () => {
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch()
      : await puppeteer.launch({ headless: false });
    page = await browser.newPage();

    await page.goto("https://www.google.com", { waitUntil: "networkidle0" });
  });

  afterAll(() => {
    if (!page.isClosed()) {
      browser.close();
    }
  });

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it("should be on google search page", async () => {
    await page.waitFor(searchBox);

    const title = await page.title();
    expect(title).toEqual("Google");
  });

  it("should search for Cheese!", async () => {
    expect(!!(await page.$(searchBox))).toBe(true);

    await page.type(searchBox, "Cheese!", { delay: 100 });
    await page.keyboard.press("\n");
  });

  it('the page title should start with "Cheese!', async () => {
    await page.waitFor("#resultStats");

    const title = await page.title();
    const words = title.split(" ");
    expect(words[0]).toEqual("Cheese!");
  });
});
