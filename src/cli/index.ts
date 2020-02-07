import program from "commander";
program.version("0.0.0").name("cookiecord");

if (process.argv.length < 3) program.help();
program
    .command("generate <name>")
    .description("generate a new cookiecord bot")
    .action(cmd => {
        const name = cmd.parent.args[0] as string;
    });

program.parse(process.argv);
