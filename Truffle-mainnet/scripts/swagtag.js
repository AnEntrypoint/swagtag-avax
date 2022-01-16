var fs = require("fs");

fs.copyFile("build/contracts/swagtag.json", "../src/contracts/swagtag.json", (err) => {
  if (err) throw err;
  console.log("✅ Your contract's ABI was copied to the frontend");
});
