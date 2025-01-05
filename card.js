#!/usr/bin/env node

'use strict';

import boxen from "boxen";
import chalk from "chalk";

import { createPromptModule } from "inquirer";
import clear from "clear";
import open from "open";
import { createWriteStream } from 'fs';
import axios from 'axios';
import { join } from 'path';
import ora from 'ora';

clear();

const prompt = createPromptModule();

const questions = [
    {
        type: "list",
        name: "action",
        message: "What do you want to do?",
        choices: [
            {
                name: `Send me an ${chalk.green.bold("email")}?`,
                value: () => {
                    open("mailto:varanasivsv@gmail.com");
                    console.log("\nDone, see you soon at inbox.\n");
                }
            },
            {
                name: `Download my ${chalk.magentaBright.bold("Resume")}?`,
                value: async () => {
                    const loader = ora({
                        text: 'Downloading Resume...',
                        spinner: 'dots', // Replaced 'material' with a generic spinner name
                    }).start();

                    try {
                        const url = 'https://vigneshvaranasi.in/assets/Vignesh%20Varanasi%20Resume-bPOO6lJR.pdf';
                        const response = await axios.get(url, { responseType: 'stream' }); // Fixed axios usage
                        const downloadPath = join(process.cwd(), 'Vignesh Varanasi Resume.pdf');
                        const writer = createWriteStream(downloadPath);

                        response.data.pipe(writer);

                        writer.on("finish", () => {
                            console.log(`\nResume downloaded at ${downloadPath}\n`);
                            open(downloadPath);
                            loader.stop();
                        });

                        writer.on("error", (err) => {
                            console.error(`\nError downloading resume: ${err.message}\n`);
                            loader.stop();
                        });
                    } catch (error) {
                        console.error(`\nError: ${error.message}\n`);
                        loader.stop();
                    }
                }
            },
            {
                name: "Just quit.",
                value: () => {
                    console.log("Thank you for your time!\n");
                }
            }
        ]
    }
];

const data = {
    name: chalk.green.bold("                   Vignesh Varanasi"),
    work: `${chalk.white("Currently student at ")} ${chalk.hex("#2b82b2").bold("PVPSIT")}`,
    github: chalk.gray("https://github.com/") + chalk.green("vigneshvaranasi"),
    linkedin: chalk.gray("https://linkedin.com/in/") + chalk.blue("vigneshvaranasi"),
    web: chalk.cyan("https://vigneshvaranasi.in"),
    npx: chalk.red("npx") + " " + chalk.white("vignesh"),

    labelWork: chalk.white.bold("  "),
    labelGitHub: chalk.white.bold("     GitHub:"),
    labelLinkedIn: chalk.white.bold("   LinkedIn:"),
    labelWeb: chalk.white.bold("        Web:"),
    labelCard: chalk.white.bold("       Card:")
};

const me = boxen(
    [
        `${data.name}`,
        ``,
        `${data.labelWork}  ${data.work}`,
        `${data.labelGitHub}  ${data.github}`,
        `${data.labelLinkedIn}  ${data.linkedin}`,
        `${data.labelWeb}  ${data.web}`,
        ``,
        `${data.labelCard}  ${data.npx}`,
        ``,
        `I am currently looking for new opportunities,`,
        `my inbox is always open. Whether you have a`,
        `question or just want to say hi, I will try `,
        `my best to get back to you!`
    ].join("\n"),
    {
        margin: 1,
        float: 'center',
        padding: 1,
        borderStyle: "single",
        borderColor: "green"
    }
);

console.log(me);

const tip = [
    `Tip: Try ${chalk.cyanBright.bold("cmd/ctrl + click")} on the links above`,
    '',
].join("\n");

console.log(tip);

prompt(questions).then(answer => answer.action());
