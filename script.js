document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("file-list");
    container.innerHTML = "";

    // GitHub Repo 參數
    const REPO_OWNER = "Tektronix-Nelenk";
    const REPO_NAME = "Tektronix-Nelenk.github.io";
    const DIRECTORY = "script"; // 要加載的資料夾

    // API 路徑
    const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${DIRECTORY}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`API 加載失敗: ${response.status}`);
            return response.json();
        })
        .then(data => {
            // 遍歷資料夾和文件
            data.forEach(item => {
                if (item.type === "dir") {
                    // 創建資料夾元素
                    const folderContainer = document.createElement("div");
                    folderContainer.classList.add("folder");
                    folderContainer.textContent = `📁 ${item.name}`;

                    // 子資料夾容器
                    const subContainer = document.createElement("div");
                    subContainer.classList.add("subfolder");
                    subContainer.style.display = "none"; // 初始隱藏

                    // 資料夾點擊事件：展開/收起子資料夾
                    folderContainer.addEventListener("click", () => {
                        subContainer.style.display = subContainer.style.display === "none" ? "block" : "none";
                    });

                    // 附加到主容器
                    container.appendChild(folderContainer);
                    container.appendChild(subContainer);

                    // 遞迴加載子資料夾內容
                    fetchFiles(item.path, subContainer);
                } else if (item.type === "file") {
                    // 創建文件鏈接
                    const fileLink = document.createElement("a");
                    fileLink.href = item.download_url;
                    fileLink.textContent = `📄 ${item.name}`;
                    fileLink.classList.add("file");
                    fileLink.target = "_blank";

                    // 添加到主容器
                    container.appendChild(fileLink);
                }
            });
        })
        .catch(error => {
            console.error("Error:", error);
            container.innerHTML = `<span style="color: red;">無法加載內容</span>`;
        });
});

// 遞迴函數：加載子目錄
function fetchFiles(directory, container) {
    const apiUrl = `https://api.github.com/repos/Tektronix-Nelenk/Tektronix-Nelenk.github.io/contents/${directory}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`無法加載子目錄: ${response.status}`);
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
                    subContainer.style.display = "none";

                    folderContainer.addEventListener("click", () => {
                        subContainer.style.display = subContainer.style.display === "none" ? "block" : "none";
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
            console.error("Error fetching files:", error);
        });
}
