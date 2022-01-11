export const splitMessage = (message: string) => {
    const a = message.indexOf('[')
    const b = message.indexOf(']')
    return [message.substring(a + 1, b), message.substring(b + 1)]
}
