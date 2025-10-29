import fs from "fs";

function bigIntFromBase(str, base) {
  const digits = "0123456789abcdefghijklmnopqrstuvwxyz";
  let result = 0n;
  for (const ch of str.toLowerCase()) {
    const digit = BigInt(digits.indexOf(ch));
    result = result * BigInt(base) + digit;
  }
  return result;
}

function lagrangeAtZero(x, y) {
  const k = x.length;
  let result = 0n;
  for (let i = 0; i < k; i++) {
    let num = 1n;
    let den = 1n;
    const xi = BigInt(x[i]);
    for (let j = 0; j < k; j++) {
      if (i === j) continue;
      const xj = BigInt(x[j]);
      num *= -xj;
      den *= xi - xj;
    }
    result += y[i] * (num / den);
  }
  return result;
}

function getPointsFromJSON(fileName) {
  const data = JSON.parse(fs.readFileSync(fileName, "utf8"));
  const n = data.keys.n;
  const k = data.keys.k;
  const x = [];
  const y = [];

  for (const [key, value] of Object.entries(data)) {
    if (key === "keys") continue;
    const base = parseInt(value.base);
    const yDecoded = bigIntFromBase(value.value, base);
    x.push(parseInt(key));
    y.push(yDecoded);
  }

  const points = x.map((val, i) => ({ x: val, y: y[i] }))
    .sort((a, b) => a.x - b.x)
    .slice(0, k);

  return { x: points.map(p => p.x), y: points.map(p => p.y) };
}

function findSecret(fileName) {
  const { x, y } = getPointsFromJSON(fileName);
  const secret = lagrangeAtZero(x, y);

  const mod = 2n ** 256n;
  const positiveSecret = ((secret % mod) + mod) % mod;

  console.log("Secret for", fileName, "=>", positiveSecret.toString());
}

findSecret("testcase1.json");
findSecret("testcase2.json");