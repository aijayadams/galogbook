#!/usr/bin/env ts-node

import { Command } from "commander";

const program = new Command();

program
  .name("my-cli")
  .description("Example CLI inside a Next.js project")
  .version("0.1.0");

program
  .command("hello")
  .description("Say hello")
  .argument("[name]", "Name to greet", "world")
  .action((name) => {
    console.log(`Hello, ${name}!`);
  });

program.parse(process.argv);
