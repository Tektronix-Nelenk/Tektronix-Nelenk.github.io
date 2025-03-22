const GITHUB_TOKEN = "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"; // ⚠️ 在這裡填入你的 Token

async function fetchFiles(directory, container) {
    const url = `https://api.github.com/repos/Tektronix-Nelenk/Tektronix-Nelenk.github.io/contents/${directory}?ref=main`;
    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": `token ${GITHUB_TOKEN}`
            }
        });

        if (!response.ok) throw new Error(`Failed to load: ${response.status}`);
        const data = await response.json();

        const folders = data.filter(item => item.type === "dir");
        const files = data.filter(item => item.type === "file");

        for (const folder of folders) {
            const folderContainer = document.createElement("div");
            folderContainer.classList.add("folder");
            folderContainer.innerHTML = `📁 ${folder.name}`;

            const subContainer = document.createElement("div");
            subContainer.classList.add("subfolder");

            folderContainer.addEventListener("click", () => {
                subContainer.style.display = subContainer.style.display === "none" ? "block" : "none";
            });

            container.appendChild(folderContainer);
            container.appendChild(subContainer);
            await fetchFiles(folder.path, subContainer);
        }

        for (const file of files) {
            const fileLink = document.createElement("a");
            fileLink.href = file.download_url;
            fileLink.textContent = `📄 ${file.name}`;
            fileLink.classList.add("file");
            fileLink.target = "_blank";
            container.appendChild(fileLink);
        }
    } catch (error) {
        console.error(`Error fetching ${directory}:`, error);
        container.innerHTML = `<span style="color: red;">error ${directory}</span>`;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("file-list");
    container.innerHTML = "";
    fetchFiles("script", container);
});
