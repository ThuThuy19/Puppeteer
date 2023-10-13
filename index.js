const Hidemyacc = require("./hidemyacc");
const hidemyacc = new Hidemyacc();
const puppeteer = require("puppeteer-core");
const delay = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

!(async () => {
  try {
    //Get list acc
    const listAcc = `janinefardo53467	wbxzebbht	janinefardo53467@mitool.co
    jameypotters17266	tjzghxlkm	jameypotters17266@mitool.co
    mayepanzarella55130	ddoowjlyxbyba	mayepanzarella55130@mitool.co
    oraliamurray49107	yzttyvsclkjpnm	oraliamurray49107@mitool.co
    teddydemetris83489	tghmhwetmt	teddydemetris83489@mitool.co
    miguelpelligra84210	atvbzedqh	miguelpelligra84210@mitool.co
    olaweatherill88622	qffyrsxlgnzdfb	olaweatherill88622@mitool.co
    doloristufts10061	teqjtbgroh	doloristufts10061@mitool.co
    wanbrison62058	qefbugsjydf	wanbrison62058@mitool.co
    mabellepino15622	vpmhnxegeml
    pamulaletterlough23031	tykklndm	pamulaletterlough23031@mitool.co`.split("\n");

    let account = listAcc.map((acc) => {
      const arr = acc.split("\t");
      return {
        email: arr[0],
        password: arr[1],
        recovery: arr[2],
      };
    });
    let acc__copy = []; //Tao mang moi de lay ra nhung email bi loi
    const maxLoginAttempts = 2; //So lan dang nhap toi da

    for (let i = 0; i < account.length; i++) {

      const result = await ProfileID();
      const page = result.Page;
      const profileId = result.profileID;
      const loginResult = await loginGmail(
        page,
        account[i].email.trim(),
        account[i].password.trim()
      );
      console.log(loginResult);
      if (loginResult.success) {
        console.log(loginResult.msg);
      } else {
        acc__copy.push(account[i]);
        console.log("Loi: " + loginResult.msg);
      }
      await hidemyacc.stop(profileId);
      await hidemyacc.delete(profileId);
    }
    //Check so lan dang nhap
    for (let j = 0; j < maxLoginAttempts; j++) {
      for (let k = 0; k < acc__copy.length; k++) {
        const result = await ProfileID();
        const page = result.Page;
        const profileId = result.profileID;
        let loginResult = await loginGmail(
          page,
          acc__copy[k].email.trim(),
          acc__copy[k].password.trim()
        );
        if (loginResult.success) {
          console.log(loginResult);
        } else {
          console.log("Loi: " + loginResult.msg);
          console.log("So lan lap con lai: " + (maxLoginAttempts - j));
          console.log("Khong dang nhap duoc tai khoan: " + acc__copy[k].email);
        }
        await hidemyacc.stop(profileId);
        await hidemyacc.delete(profileId);
      }
    }
  } catch (e) {
    console.error(e.message);
  }
})();

//Create,stop,delete ProfileID
async function ProfileID() {
  try {
    //create ProfileID
    let profile = {
      id: "",
      name: "Login",
      os: "win",
      platform: "Win32",
      browserSource: "ghosty",
      browserType: "chrome",
      proxy: {
        proxyEnabled: false,
        autoProxyServer: "",
        autoProxyUsername: "",
        autoProxyPassword: "",
        changeIpUrl: "",
        mode: "http",
        port: 80,
        autoProxyRegion: "VN",
        torProxyRegion: "us",
        host: "",
        username: "",
        password: "",
      },
    };
    let user = await hidemyacc.create(profile);
    // let getProfile = await hidemyacc.profiles(user);
    let profileId = await user.data.id;
    const response = await hidemyacc.start(profileId);
    if (response.code !== 1) {
      throw new Error("Khong mo duoc trinh duyet");
    }

    const browser = await puppeteer.connect({
      browserWSEndpoint: response.data.wsUrl,
      defaultViewport: null,
      slowMo: 60,
    });

    const pages = await browser.pages();
    let page;

    if (pages.length) {
      page = pages[0];
    } else {
      page = await browser.newPage();
    }
    await page.goto("https://accounts.google.com/", {
      waitUntil: "networkidle2",
      timeout: 5000,
    });
    return { profileID: profileId, Page: page };
  } catch (e) {
    console.log(e.message);
  }
}

//Login email
async function inputEmail(page, email) {
  try {
    await page.type('input[type="email"]', email);
    await delay(1000);
    await page.keyboard.press("Enter");
    await delay(3000);
  } catch (e) {
    console.error(e.message);
  }
}
//login pasword
async function inputPassword(page, password) {
  try {
    await page.type('input[type="password"]', password);
    await delay(1000);
    await page.keyboard.press("Enter");
    await delay(3000);
  } catch (e) {
    console.error(e.message);
  }
}
//login gmail return success and msg
async function loginGmail(page, email, password) {
  try {
    const response = {
      success: false,
      msg: "",
    };
    let currentUrl = await page.url();
    if (currentUrl.includes("/v3/signin/identifier")) {
      await inputEmail(page, email);
      currentUrl = await page.url();
      const error = await page.$('div[jsname="B34EJ"]');
      const error2 = await page.$("#ca");
      if (error && error2 && currentUrl.includes("/v3/signin/identifier")) {
        response.success = false;
        response.msg = "Loi nhap lai email";
        return response;
      } else if (currentUrl.includes("/v3/signin/identifier") && error) {
        response.success = false;
        response.msg = "Loi sai email";
        return response;
      } 
      return await loginGmail(page, email, password);
    } else if (currentUrl.includes("/signin/v2/challenge/recaptcha")) {
      response.success = false;
      response.msg = "Loi captcha";
      return response;
    } else if (currentUrl.includes("/v3/signin/challenge/pwd")) {
      await inputPassword(page, password);
      currentUrl = await page.url();
      const errorPass = await page.$('div[jsname="B34EJ"]');
      if (errorPass && currentUrl.includes("/v3/signin/challenge/pwd")) {
        response.success = false;
        response.msg = "Nhap sai mat khau";
        return response;
      }
      return await loginGmail(page, email, password);
    } else if (currentUrl.includes("myaccount.google.com")) {
      response.success = true;
      response.msg = "Dang nhap thanh cong";
      return response;
    } else {
      response.success = false;
      response.msg = "khong nhap dc";
     
    }
    return response;
  } catch (e) {
    console.error(e.message);
  }
}
