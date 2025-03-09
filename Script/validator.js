class CodeValidator {
    constructor(id) {
        this.id = id;
    }

    // HTML
    validateHTML(html) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, "text/html");
        let errors = doc.querySelectorAll("parsererror");
        if (errors.length > 0) {
            console.error(`[${this.id}] HTML Error:`, errors[0].textContent);
        } else {
            console.log(`[${this.id}] HTML is valid.`);
        }
    }

    // CSS
    validateCSS(css) {
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

    // JAVASCRIPT
    validateJS(js) {
        try {
            new Function(js);
            console.log(`[${this.id}] JavaScript is valid.`);
        } catch (error) {
            console.error(`[${this.id}] JavaScript Error: ${error.message}`);
        }
    }

    // Get HTML CSS JAVASCRIPT 
    validatePage() {
        console.log(`[${this.id}] Checking HTML, CSS, and JavaScript...`);

        // Check HTML
        this.validateHTML(document.documentElement.outerHTML);

        // Check CSS
        let cssCode = "";
        document.querySelectorAll("style").forEach(style => cssCode += style.textContent + "\n");
        document.querySelectorAll("link[rel='stylesheet']").forEach(link => {
            fetch(link.href)
                .then(response => response.text())
                .then(css => this.validateCSS(css))
                .catch(error => console.error(`[${this.id}] CSS Fetch Error: ${error.message}`));
        });
        this.validateCSS(cssCode);

        // Check JAVASCRIPT 
        let jsCode = "";
        document.querySelectorAll("script:not([src])").forEach(script => jsCode += script.textContent + "\n");
        this.validateJS(jsCode);
    }
}

// initialization
const validator = new CodeValidator("Md-0001");

// Page load check
document.addEventListener("DOMContentLoaded", () => {
    validator.validatePage();
});