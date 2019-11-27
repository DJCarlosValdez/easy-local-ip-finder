const { ipcRenderer } = require("electron")

window.addEventListener("load", () => {
    ipcRenderer.send("reqIP")
})

ipcRenderer.on("resIP", (event, arg) => {
    if (arg) {
        document.querySelector("#ip").innerHTML = arg
    }
})