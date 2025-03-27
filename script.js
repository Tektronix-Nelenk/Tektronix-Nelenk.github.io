// URL 返回 JSON 格式的公開數據
const jsonUrl = "https://coder.ct.ws/GITHUB_TOKEN/files.json";

document.addEventListener("DOMContentLoaded", async function () {
    const container = document.getElementById("file-list");
    container.innerHTML = `<span style="color: blue;">Loading...</span>`;

    try {
        // 發送請求並接收 JSON 數據
        const response = await fetch(jsonUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // 解析 JSON 數據
        const jsonData = await response.json();
        container.innerHTML = ""; // 清除 Loading 提示

        // 遍歷 JSON 數據並渲染到頁面
        jsonData.forEach(item => {
            if (item.type === "dir") {
                createFolderElement(item.name, item.path, container);
            } else if (item.type === "file") {
                createFileElement(item.name, item.download_url, container);
            }
        });
    } catch (error) {
        console.error("錯誤：", error);
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
            console.log(`${path}`); // 打印資料夾路徑
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