class Terminal {
    constructor(div, form) {
        this.setup(div, form);
    }
    api = {
        textColor: (hex) => {
            TERMINAL.div.style.color = hex;
            TERMINAL.input.style.color = hex;
            TERMINAL.form.style.color = hex;
        },
        backgroundColor: (hex) => {
            TERMINAL.div.style.backgroundColor = hex;
        },
        print: (text) => {
            TERMINAL.addLine(text);
        },
        version: "1.0.0",
        clear: () => {
            TERMINAL.clear();
        }

    }
    process_input(event) {
        let input = TERMINAL.input.value;
        TERMINAL.addLine(`~$ ${input}`);
        if (input == "clear") {
            TERMINAL.clear();
        }
        else if (input == "version") {
            TERMINAL.addLine("Version: " + TERMINAL.version);
        }
        else if (input == "help") {
            TERMINAL.addLine("clear - Clears the terminal");
            TERMINAL.addLine("version - Displays the version of the terminal");
            TERMINAL.addLine("help - Displays this help message");
            TERMINAL.addLine("reload - Reloads the terminal");
            TERMINAL.addLine("exec - Executes SuperScript code");
        }
        else if (input == "reload") {
            TERMINAL.reload();
        }
        else if (input.startsWith("exec")) {
            let input1 = input.substring(5);
            let input_list = input1.split(";");
            for (let i = 0; i < input_list.length; i++) {
                let code =  `TERMINAL.api.${input_list[i]}`;
                try {
                    eval(code);
                }
                catch (e) {
                    TERMINAL.addLine(e.message);
                }
            }
        }

        else {
            TERMINAL.addLine("Unknown command: " + input);
        }
        event.preventDefault();
        TERMINAL.form.reset();
        TERMINAL.update_div();
        TERMINAL.save_to_local_storage();
    }
    addLine(text) {
        this.current_display.push(text);
    }
    save_to_local_storage() {
        try {
            localStorage.setItem("terminal_display", JSON.stringify(this.current_display));
        }
        catch(e){
            console.log(e);
        }
    }
    get_from_local_storage() {
        if (localStorage.getItem("terminal_display") != null) {
            return JSON.parse(localStorage.getItem("terminal_display"));
        } else {
            return [`SuperTerm WEB [Version ${Terminal.version}`,`(c) 2022 OneSpark LLC. All rights reserved.`, ``];
        }
    }
    removeLastLine() {
        this.current_display.pop();
    }
    clear() {
        this.current_display = [];
    }
    print() {
        this.current_display.forEach(line => {
            console.log(line);
        });
    }
    removeLine(index) {
        this.current_display.splice(index, 1);
    }
    setup(div, form) {
        this.version = "1.0.0";
        this.current_display = this.get_from_local_storage();
        this.div = div;
        this.form = form;
        this.input = form["terminal-input"];
        form.addEventListener('submit', this.process_input, false);
        this.update_div();

    }
    reload() {
        this.current_display = [`SuperTerm WEB [Version ${TERMINAL.version}`,`(c) 2022 OneSpark LLC. All rights reserved.`, ``];
        this.update_div();
    }
    update_div() {
        this.div.innerHTML = "";
        this.current_display.forEach(line => {
            this.div.innerHTML += line + "<br>";
        });
    }
}

const TERMINAL = new Terminal(div=document.getElementById("terminal-output"), form=document.forms["input-form"]);
