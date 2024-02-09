#!/usr/bin/env node

'use strict';

const boxen = require("boxen");
const chalk = require("chalk");
const inquirer = require("inquirer");
const clear = require("clear");
const open = require("open");
const fs = require('fs');
const request = require('request');
const path = require('path');
const ora = require('ora');
const cliSpinners = require('cli-spinners');

clear();

const prompt = inquirer.createPromptModule();

const questions = [
    {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
            {
                name: `Send me an ${chalk.green.bold("email")}`,
                value: () => {
                    open("mailto:varanasivsv@gmail.com");
                    console.log("\nEmail sent! I'll get back to you soon.\n");
                }
            },
            {
                name: `Download my ${chalk.magentaBright.bold("resume")}`,
                value: () => {
                    const loader = ora({
                        text: 'Downloading Resume',
                        spinner: cliSpinners.material,
                    }).start();
                    let pipe = request('https://vigneshvaranasi.me/').pipe(fs.createWriteStream('./vignesh-resume.html'));
                    pipe.on("finish", function () {
                        let downloadPath = path.join(process.cwd(), 'vignesh-resume.html');
                        console.log(`\nResume downloaded at ${chalk.blue(downloadPath)}\n`);
                        open(downloadPath);
                        loader.stop();
                    });
                }
            },
            {
                name: "Quit",
                value: () => {
                    console.log("\nThank you for your time!\n");
                }
            }
        ]
    }
];

const data = {
    name: chalk.bold.green("                 Vignesh Varanasi"),
    work: `${chalk.white("Student at ")} ${chalk.hex("#2b82b2").bold("PVPSIT")}`,
    github: chalk.gray("GitHub:") + chalk.green(" vigneshvaranasi"),
    linkedin: chalk.gray("LinkedIn:") + chalk.blue(" vigneshvaranasi"),
    web: chalk.gray("Website:") + chalk.cyan(" vigneshvaranasi.me"),
    npx: chalk.red("npx") + " " + chalk.white("vignesh"),

    labelWork: chalk.white.bold("         Work:"),
    labelGitHub: chalk.white.bold("     GitHub:"),
    labelLinkedIn: chalk.white.bold("   LinkedIn:"),
    labelWeb: chalk.white.bold("     Website:"),
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
        `${chalk.italic("I'm currently open to new opportunities.")}`,
        `${chalk.italic("Feel free to reach out via email or LinkedIn.")}`
    ].join("\n"),
    {
        margin: 1,
        float: 'center',
        padding: 1,
        borderStyle: "round",
        borderColor: "green"
    }
);

console.log(me);

const tip = [
    `Tip: Use ${chalk.cyanBright.bold("cmd/ctrl + click")} on the links above.`,
    ''
].join("\n");
console.log(tip);

prompt(questions).then(answer => answer.action());
