#!/usr/bin/env ts-node

import { Command } from "commander";
import fs from "fs";
import { extractInvoiceData } from "@/lib/fuel";

async function main(pdfPath: string) {
  const buf = fs.readFileSync(pdfPath);
  const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  const result = await extractInvoiceData(arrayBuffer);
  console.log(result);
}


const program = new Command();

program
  .name("my-cli")
  .description("Example CLI inside a Next.js project")
  .version("0.1.0");

program
  .command("hello")
  .description("Say hello")
  .argument("[name]", "Name to greet", "world")
  .action((name: string) => {
    console.log(`Hello, ${name}!`);
  });

program
  .command("run")
  .description("Extract fuel data from a PDF invoice")
  .argument("<pdfPath>", "Path to a PDF invoice")
  .action(async (pdfPath: string) => {
    await main(pdfPath);
  });

program.parse(process.argv);
