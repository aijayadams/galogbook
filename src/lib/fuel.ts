import fs from "fs";
import { PdfReader } from "pdfreader";

export async function extractInvoiceData() {
    // TODO:  Change me
  const dataBuffer = fs.readFileSync("./Invoice_09012025.pdf");

  const results: string[] = await new Promise((resolve, reject) => {
    const texts: string[] = [];

    new PdfReader().parseBuffer(dataBuffer, (err, item) => {
      if (err) {
        reject(err);
      } else if (!item) {
        resolve(texts);
      } else if (item.text) {
        texts.push(item.text);
      }
    });
  });

  const idx = results.indexOf("Gallons");
  if (idx === -1 || idx === 0 || idx === results.length - 1) {
    throw new Error("Could not locate Gallons in PDF text");
  }

  const fuelGal = parseFloat(results[idx - 1]);
  const fuelDollars = parseFloat(results[idx + 1].replace("$", ""));

  return { fuelDollars, fuelGal };
}
