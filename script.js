const protectedUrl = "https://coder.ct.ws/GITHUB_TOKEN"; // 您的公開鏈接

const REPO_OWNER = "Tektronix-Nelenk";
const REPO_NAME = "Tektronix-Nelenk.github.io";
const DIRECTORY = "script";

document.addEventListener("DOMContentLoaded", async function () {
    const container = document.getElementById("file-list");
    container.innerHTML = `<span style="color: blue;">Loading...</span>`;

    try {
        // 獲取公開的 GitHub Token
        const tokenResponse = await fetch(protectedUrl);
        if (!tokenResponse.ok) {
            throw new Error(` ${tokenResponse.status}`);
        }

        const GITHUB_TOKEN = await tokenResponse.text(); // 讀取 Token 文本

        // 使用 Token 訪問 GitHub API
        const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${DIRECTORY}`;
        const filesResponse = await fetch(apiUrl, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN.trim()}` // 使用獲取的 Token
            }
        });

        if (!filesResponse.ok) {
            throw new Error(` ${filesResponse.status}`);
        }

        const filesData = await filesResponse.json();
        container.innerHTML = ""; // 清除 Loading 提示

        // 渲染文件列表
        filesData.forEach(item => {
            if (item.type === "dir") {
                createFolderElement(item.name, item.path, container);
            } else if (item.type === "file") {
                createFileElement(item.name, item.download_url, container);
            }
        });
    } catch (error) {
        console.error("", error);
        container.innerHTML = `<span style="color: red;"></span>`;
    }
});

// 創建資料夾元素
function createFolderElement(name, path, parentContainer) {
    const folderContainer = document.createElement("div");
    folderContainer.classList.add("folder");
    folderContainer.textContent = `📁 ${name}`;

    const subContainer = document.createElement("div");
    subContainer.classList.add("subfolder");

    folderContainer.addEventListener("click", () => {
        subContainer.classList.toggle("visible");
        if (subContainer.classList.contains("visible") && subContainer.childElementCount === 0) {
            fetchSubfolderFiles(path, subContainer);
        }
    });

    parentContainer.appendChild(folderContainer);
    parentContainer.appendChild(subContainer);
}

// 創建文件元素
function createFileElement(name, downloadUrl, parentContainer) {
    const fileLink = document.createElement("a");
    fileLink.href = downloadUrl;
    fileLink.textContent = `📄 ${name}`;
    fileLink.classList.add("file");
    fileLink.target = "_blank"; // 在新標籤中打開文件
    parentContainer.appendChild(fileLink);
}

// 加載子資料夾文件
async function fetchSubfolderFiles(path, parentContainer) {
    const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
    try {
        const response = await fetch(apiUrl, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN.trim()}`
            }
        });

        if (!response.ok) {
            throw new Error(` ${response.status}`);
        }

        const data = await response.json();
        data.forEach(item => {
            if (item.type === "dir") {
                createFolderElement(item.name, item.path, parentContainer);
            } else if (item.type === "file") {
                createFileElement(item.name, item.download_url, parentContainer);
            }
        });
    } catch (error) {
        console.error("", error);
        parentContainer.innerHTML = `<span style="color: red;"></span>`;
    }
}