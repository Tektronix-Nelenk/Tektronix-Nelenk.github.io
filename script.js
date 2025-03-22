document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("file-list");
    container.innerHTML = "";

    // GitHub Repo 信息
    const REPO_OWNER = "Tektronix-Nelenk";
    const REPO_NAME = "Tektronix-Nelenk.github.io";
    const DIRECTORY = "script"; // 要加載的資料夾

    // 構建 API 請求 URL
    const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${DIRECTORY}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`API 請求失敗: ${response.status}`);
            return response.json();
        })
        .then(data => {
            data.forEach(item => {
                if (item.type === "file" && item.name.endsWith(".lua")) {
                    // 創建文件鏈接，專門處理 .lua 文件
                    const fileLink = document.createElement("a");
                    fileLink.href = item.download_url; // 指向文件的下載地址
                    fileLink.textContent = `📄 ${item.name}`;
                    fileLink.classList.add("file");
                    fileLink.target = "_blank"; // 在新標籤中打開
                    container.appendChild(fileLink);
                } else if (item.type === "dir") {
                    // 創建資料夾
                    const folder = document.createElement("div");
                    folder.classList.add("folder");
                    folder.textContent = `📁 ${item.name}`;

                    const subContainer = document.createElement("div");
                    subContainer.classList.add("subfolder");
                    subContainer.style.display = "none"; // 初始隱藏子資料夾

                    // 點擊事件，展開/收起子資料夾
                    folder.addEventListener("click", () => {
                        subContainer.style.display = subContainer.style.display === "none" ? "block" : "none";
                    });

                    container.appendChild(folder);
                    container.appendChild(subContainer);

                    // 遞迴加載子資料夾內容
                    fetchFiles(item.path, subContainer);
                }
            });
        })
        .catch(error => {
            console.error("加載失敗：", error);
            container.innerHTML = `<span style="color: red;">無法加載內容</span>`;
        });
});

// 遞迴函數：加載子資料夾內容
function fetchFiles(directory, container) {
    const apiUrl = `https://api.github.com/repos/Tektronix-Nelenk/Tektronix-Nelenk.github.io/contents/${directory}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`子資料夾加載失敗: ${response.status}`);
            return response.json();
        })
        .then(data => {
            data.forEach(item => {
                if (item.type === "file" && item.name.endsWith(".lua")) {
                    const fileLink = document.createElement("a");
                    fileLink.href = item.download_url;
                    fileLink.textContent = `📄 ${item.name}`;
                    fileLink.classList.add("file");
                    fileLink.target = "_blank";
                    container.appendChild(fileLink);
                } else if (item.type === "dir") {
                    const folder = document.createElement("div");
                    folder.classList.add("folder");
                    folder.textContent = `📁 ${item.name}`;

                    const subContainer = document.createElement("div");
                    subContainer.classList.add("subfolder");
                    subContainer.style.display = "none";

                    folder.addEventListener("click", () => {
                        subContainer.style.display = subContainer.style.display === "none" ? "block" : "none";
                    });

                    container.appendChild(folder);
                    container.appendChild(subContainer);
                    fetchFiles(item.path, subContainer);
                }
            });
        })
        .catch(error => {
            console.error("Error fetching subfolder:", error);
        });
}
