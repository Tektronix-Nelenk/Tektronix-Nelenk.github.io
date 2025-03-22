// 您的 GitHub Token，請替換為您的實際 Token
const GITHUB_TOKEN = "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"; // 確保這個 Token 是只讀的

const REPO_OWNER = "Tektronix-Nelenk";
const REPO_NAME = "Tektronix-Nelenk.github.io";
const DIRECTORY = "script"; // 要加載的資料夾
const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${DIRECTORY}`;

document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("file-list");
    container.innerHTML = "";

    fetch(apiUrl, {
        headers: {
            Authorization: `token ${GITHUB_TOKEN}` // 使用 GitHub Token
        }
    })
        .then(response => {
            if (!response.ok) throw new Error(`API 請求失敗: ${response.status}`);
            return response.json();
        })
        .then(data => {
            data.forEach(item => {
                if (item.type === "dir") {
                    // 創建資料夾元素
                    const folderContainer = document.createElement("div");
                    folderContainer.classList.add("folder");
                    folderContainer.textContent = `📁 ${item.name}`;

                    // 子資料夾容器
                    const subContainer = document.createElement("div");
                    subContainer.classList.add("subfolder");

                    // 點擊事件：展開/收起
                    folderContainer.addEventListener("click", () => {
                        subContainer.classList.toggle("visible");
                    });

                    container.appendChild(folderContainer);
                    container.appendChild(subContainer);

                    // 遞迴加載子目錄
                    fetchFiles(item.path, subContainer);
                } else if (item.type === "file") {
                    // 創建文件鏈接
                    const fileLink = document.createElement("a");
                    fileLink.href = item.download_url;
                    fileLink.textContent = `📄 ${item.name}`;
                    fileLink.classList.add("file");
                    fileLink.target = "_blank";
                    container.appendChild(fileLink);
                }
            });
        })
        .catch(error => {
            console.error("加載失敗：", error);
            container.innerHTML = `<span style="color: red;">無法加載內容</span>`;
        });
});

// 遞迴加載子資料夾內容
function fetchFiles(directory, container) {
    const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${directory}`;

    fetch(apiUrl, {
        headers: {
            Authorization: `token ${GITHUB_TOKEN}` // 使用 GitHub Token
        }
    })
        .then(response => {
            if (!response.ok) throw new Error(`子資料夾加載失敗: ${response.status}`);
            return response.json();
        })
        .then(data => {
            data.forEach(item => {
                if (item.type === "dir") {
                    const folderContainer = document.createElement("div");
                    folderContainer.classList.add("folder");
                    folderContainer.textContent = `📁 ${item.name}`;

                    const subContainer = document.createElement("div");
                    subContainer.classList.add("subfolder");

                    folderContainer.addEventListener("click", () => {
                        subContainer.classList.toggle("visible");
                    });

                    container.appendChild(folderContainer);
                    container.appendChild(subContainer);
                    fetchFiles(item.path, subContainer);
                } else if (item.type === "file") {
                    const fileLink = document.createElement("a");
                    fileLink.href = item.download_url;
                    fileLink.textContent = `📄 ${item.name}`;
                    fileLink.classList.add("file");
                    fileLink.target = "_blank";
                    container.appendChild(fileLink);
                }
            });
        })
        .catch(error => {
            console.error("Error fetching subfolder:", error);
        });
}
