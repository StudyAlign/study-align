
// Human-readable label for a user object: "username (First Last)".
export const userLabel = (u) => {
    if (!u) return "unknown user"
    const full = [u.firstname, u.lastname].filter(Boolean).join(" ")
    return full ? `${u.name} (${full})` : u.name
}

export const reformatDate = (dateString) => {
    const date = new Date(dateString)
    let day = date.getDate()
    if(day < 10) day = "0" + day
    let month = date.getMonth() + 1
    if(month < 10) month = "0" + month
    let year = date.getFullYear()
    return day + "." + month + "." + year
}