#!/usr/bin/env ts-node

import { Command } from "commander";
import { extractInvoiceData } from "@/lib/fuel";

async function main() {
  // Get the 
  let result = await extractInvoiceData();
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
    .action(async () => {
      await main();
    });

program.parse(process.argv);
