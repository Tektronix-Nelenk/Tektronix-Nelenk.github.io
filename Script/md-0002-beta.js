class CodeValidator {
    constructor(id) {
        this.id = id;
    }

    // Validate HTML syntax
    validateHTML(html) {
        if (!html.trim()) return;
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, "text/html");
        let errors = doc.querySelectorAll("parsererror");
        if (errors.length > 0) {
            console.error(`[${this.id}] HTML Error:`, errors[0].textContent);
        } else {
            console.log(`[${this.id}] HTML is valid.`);
        }
    }

    // Validate CSS syntax
    validateCSS(css) {
        if (!css.trim()) return;
        let style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);
        if (style.sheet && style.sheet.cssRules.length > 0) {
            console.log(`[${this.id}] CSS is valid.`);
        } else {
            console.error(`[${this.id}] CSS Error: Invalid CSS syntax.`);
        }
        document.head.removeChild(style);
    }

    // Validate JavaScript syntax
    validateJS(js) {
        if (!js.trim()) return;
        try {
            new Function(js);
            console.log(`[${this.id}] JavaScript is valid.`);
        } catch (error) {
            console.error(`[${this.id}] JavaScript Error: ${error.message}`);
        }
    }

    // Validate PHP syntax via an external PHP validation API
    async validatePHP(php) {
        if (!php.trim()) return;
        try {
            let response = await fetch("https://phpcodechecker.com/api/validate", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `code=${encodeURIComponent(php)}`
            });
            let result = await response.json();
            if (result.errors.length > 0) {
                console.error(`[${this.id}] PHP Errors:\n`, result.errors.join("\n"));
            } else {
                console.log(`[${this.id}] PHP is valid.`);
            }
        } catch (error) {
            console.error(`[${this.id}] PHP Validation Error: ${error.message}`);
        }
    }

    // Extract and validate all code types from the current page
    async validatePage() {
        console.log(`[${this.id}] Checking HTML, CSS, JavaScript, and PHP...`);

        // Validate HTML
        let htmlCode = document.documentElement.outerHTML;
        this.validateHTML(htmlCode);

        // Validate CSS
        let cssCode = "";
        document.querySelectorAll("style").forEach(style => cssCode += style.textContent + "\n");
        document.querySelectorAll("link[rel='stylesheet']").forEach(async link => {
            try {
                let response = await fetch(link.href);
                let css = await response.text();
                this.validateCSS(css);
            } catch (error) {
                console.error(`[${this.id}] CSS Fetch Error: ${error.message}`);
            }
        });
        this.validateCSS(cssCode);

        // Validate JavaScript
        let jsCode = "";
        document.querySelectorAll("script:not([src])").forEach(script => jsCode += script.textContent + "\n");
        this.validateJS(jsCode);

        // Validate PHP (if PHP code exists within <code> tags)
        let phpCode = "";
        document.querySelectorAll("code.language-php").forEach(code => phpCode += code.textContent + "\n");
        await this.validatePHP(phpCode);
    }
}

// Initialize the code validator
const validator = new CodeValidator("Md-0002-beta");

// Run validation when the page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    validator.validatePage();
});