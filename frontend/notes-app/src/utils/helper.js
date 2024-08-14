export const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(String(email).toLowerCase());
    }

export const getInitials = (name) => {
    const words = name.split(' ')
    const initials = []
    words.map(word => initials.push(word[0].toUpperCase()))
    return initials.join('')
}