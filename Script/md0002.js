class CodeValidator {
    constructor(id) {
        this.id = id;
    }

    // 通用的错误输出方法
    logError(type, message) {
        console.error(`[${this.id}] ${type} Error: ${message}`);
    }

    // 通用的成功输出方法
    logSuccess(type) {
        console.log(`[${this.id}] ${type} is valid.`);
    }

    // 检查 HTML 语法
    validateHTML(html) {
        if (!html.trim()) return;
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const errors = doc.querySelectorAll('parsererror');
        if (errors.length > 0) {
            this.logError('HTML', errors[0].textContent);
        } else {
            this.logSuccess('HTML');
        }
    }

    // 检查 CSS 语法
    validateCSS(css) {
        if (!css.trim()) return;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
        const isValid = style.sheet && style.sheet.cssRules.length > 0;
        document.head.removeChild(style);
        isValid ? this.logSuccess('CSS') : this.logError('CSS', 'Invalid CSS syntax.');
    }

    // 检查 JavaScript 语法
    validateJS(js) {
        if (!js.trim()) return;
        try {
            new Function(js);
            this.logSuccess('JavaScript');
        } catch (error) {
            this.logError('JavaScript', error.message);
        }
    }

    // 检查 PHP 语法（通过外部 PHP 验证 API）
    async validatePHP(php) {
        if (!php.trim()) return;
        try {
            const response = await fetch('https://phpcodechecker.com/api/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `code=${encodeURIComponent(php)}`,
            });
            const result = await response.json();
            if (result.errors.length > 0) {
                this.logError('PHP', result.errors.join('\n'));
            } else {
                this.logSuccess('PHP');
            }
        } catch (error) {
            this.logError('PHP Validation', error.message);
        }
    }

    // 提取并检查当前页面的所有代码类型
    async validatePage() {
        console.log(`[${this.id}] Checking HTML, CSS, JavaScript, and PHP...`);

        // 检查 HTML
        const htmlCode = document.documentElement.outerHTML;
        this.validateHTML(htmlCode);

        // 检查内联和外部 CSS
        let cssCode = '';
        document.querySelectorAll('style').forEach(style => {
            cssCode += style.textContent + '\n';
        });
        this.validateCSS(cssCode);

        const cssPromises = Array.from(document.querySelectorAll("link[rel='stylesheet']")).map(async link => {
            try {
                const response = await fetch(link.href);
                const css = await response.text();
                this.validateCSS(css);
            } catch (error) {
                this.logError('CSS Fetch', error.message);
            }
        });

        // 检查内联 JavaScript
        let jsCode = '';
        document.querySelectorAll('script:not([src])').forEach(script => {
            jsCode += script.textContent + '\n';
        });
        this.validateJS(jsCode);

        // 检查 PHP（假设 PHP 代码存在于 <code class="language-php"> 标签中）
        let phpCode = '';
        document.querySelectorAll('code.language-php').forEach(code => {
            phpCode += code.textContent + '\n';
        });
        await this.validatePHP(phpCode);

        // 等待所有外部 CSS 检查完成
        await Promise.all(cssPromises);
    }
}

// 初始化代码验证器
const validator = new CodeValidator('Md-0002');

// 当页面完全加载后运行验证
window.addEventListener('load', () => {
    validator.validatePage();
});