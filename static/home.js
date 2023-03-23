const getElementById = id => {
    return document.getElementById(id)
}

const createElement = name => {
    return document.createElement(name)
}

const drawerToggle = getElementById("drawer-toggle")

drawerToggle.checked = false
drawerToggle.addEventListener("click", () => {
    setBackground();
})

const login = getElementById("login")

login?.addEventListener("click", () => {
    window.location.replace('/loginUser')
})

const logout = getElementById("logout")

logout?.addEventListener("click", () => {
    window.location.replace('/logoutUser')
})
let loaded = false;
const setBackground = () => {
    const displayPicture = getElementById("displayPicture")
    displayPicture.crossOrigin = "192.168.29.145:4000"
    const canvas = document.createElement("canvas")
    const context = canvas.getContext('2d')
    const work = () => {
        loaded = true;
        canvas.width = displayPicture.clientWidth
        canvas.height = displayPicture.clientHeight
        displayPicture.width = 75

        context.drawImage(displayPicture, 0, 0)
        const data = context.getImageData(0, 0, canvas.width, canvas.height).data
        let count = 0;
        rgb = { r: 0, g: 0, b: 0 };
        // visit every 10 pixel
        length = data.length
        i = -4
        while ((i += 4 * 5) < length) {
            ++count;
            rgb.r += data[i];
            rgb.g += data[i + 1];
            rgb.b += data[i + 2];
        }

        rgb.r = Math.floor(rgb.r / count)
        rgb.g = Math.floor(rgb.g / count)
        rgb.b = Math.floor(rgb.b / count)

        const drawer = getElementById('drawer')
        drawer.style.backgroundColor = `rgb(${rgb.r},${rgb.g},${rgb.b})`
    }

    if (loaded) {
        work()
        return loaded
    }
    displayPicture.addEventListener("load", () => work())
}


setBackground()