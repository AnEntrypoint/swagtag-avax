var fs = require("fs");

fs.copyFile("build/contracts/DNS.json", "../src/contracts/DNS.json", (err) => {
  if (err) throw err;
  console.log("✅ Your contract's ABI was copied to the frontend");
});
