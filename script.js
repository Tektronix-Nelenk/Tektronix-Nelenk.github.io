document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("file-list");
    container.innerHTML = "";

    // 您的 GitHub 存儲庫和目錄設定
    const REPO_OWNER = "Tektronix-Nelenk";
    const REPO_NAME = "Tektronix-Nelenk.github.io";
    const DIRECTORY = "script"; // 要加載的目錄

    // 使用 GitHub API 取得文件列表
    const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${DIRECTORY}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`GitHub API 加載失敗: ${response.status}`);
            return response.json();
        })
        .then(data => {
            data.forEach(item => {
                if (item.type === "file") {
                    // 創建文件鏈接
                    const fileLink = document.createElement("a");
                    fileLink.href = item.download_url;
                    fileLink.textContent = `📄 ${item.name}`;
                    fileLink.classList.add("file");
                    fileLink.target = "_blank";
                    container.appendChild(fileLink);
                } else if (item.type === "dir") {
                    // 顯示子目錄
                    const folder = document.createElement("div");
                    folder.classList.add("folder");
                    folder.textContent = `📁 ${item.name}`;
                    container.appendChild(folder);
                }
            });
        })
        .catch(error => {
            console.error("Error:", error);
            container.innerHTML = `<span style="color: red;">無法加載文件列表</span>`;
        });
});
