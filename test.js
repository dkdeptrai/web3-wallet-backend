const selfsigned = require("selfsigned");
const fs = require("fs");

// Define attributes for the certificate
const attrs = [{ name: "192.168.50.177", value: "192.168.50.177", type: "IP" }];

try {
  // Generate the certificate
  const pems = selfsigned.generate(attrs, { days: 365 });

  // Log pems to inspect
  console.log("Generated pems:", pems);

  // Save the certificate and private key to files
  if (pems.cert) {
    fs.writeFileSync("./cert.pem", pems.cert);
    fs.writeFileSync("./key.pem", pems.private);
    console.log("Certificate and private key saved.");
  } else {
    throw new Error("Generated certificate is undefined.");
  }
} catch (err) {
  console.error("Error generating or saving self-signed certificate:", err);
}
