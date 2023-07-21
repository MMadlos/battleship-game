const body = document.getElementById("app")
const title = document.createElement("h1")
title.textContent = "TITULO PROVISIONAL"

export const appendTitle = () => body.append(title)
