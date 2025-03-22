document.addEventListener("DOMContentLoaded", function () {
    fetch("https://Tektronix-Nelenk.github.io/files.json")
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("file-list");
            renderFileTree(data, container);
        })
        .catch(error => console.error("Error loading file list:", error));
});

function renderFileTree(files, container) {
    container.innerHTML = "";
    const fileMap = {};

    files.forEach(file => {
        const parts = file.path.split("/");
        let current = fileMap;

        parts.forEach((part, index) => {
            if (!current[part]) {
                current[part] = index === parts.length - 1 ? file : {};
            }
            current = current[part];
        });
    });

    function createListItems(obj, parentElement) {
        Object.keys(obj).forEach(key => {
            const item = document.createElement("div");
            item.classList.add("file-item");

            if (typeof obj[key] === "object" && !obj[key].download_url) {
                item.innerHTML = `<span class="folder">📁 ${key}</span>`;
                const subList = document.createElement("div");
                subList.classList.add("nested");
                item.appendChild(subList);

                item.querySelector(".folder").addEventListener("click", function () {
                    subList.classList.toggle("active");
                });

                createListItems(obj[key], subList);
            } else {
                item.innerHTML = `<a href="${obj[key].download_url}" target="_blank">📄 ${key}</a>`;
            }

            parentElement.appendChild(item);
        });
    }

    createListItems(fileMap, container);
}