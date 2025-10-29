const fs = require("fs");

function lagrangeAtZero(x, y) {
  let k = x.length;
  let result = 0n;

  for (let i = 0; i < k; i++) {
    let numerator = 1n;
    let denominator = 1n;

    for (let j = 0; j < k; j++) {
      if (i === j) continue;
      numerator *= BigInt(-x[j]);
      denominator *= BigInt(x[i] - x[j]);
    }

    let li = numerator / denominator;
    result += y[i] * li;
  }
  return result;
}

function findSecretFromJSON(fileName) {
  const data = JSON.parse(fs.readFileSync(fileName, "utf8"));
  const n = data.keys.n;
  const k = data.keys.k;

  const x = [];
  const y = [];

  Object.keys(data).forEach((key) => {
    if (key === "keys") return;
    const point = data[key];
    const base = parseInt(point.base);
    const value = point.value;
    const decodedY = BigInt(parseInt(value, base));
    x.push(parseInt(key));
    y.push(decodedY);
  });

  const xk = x.slice(0, k);
  const yk = y.slice(0, k);

  const secret = lagrangeAtZero(xk, yk);
  console.log(secret.toString());
}

findSecretFromJSON("testcase.json");