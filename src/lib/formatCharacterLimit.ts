export default function formatCharacterLimit(limit: number, text: string) {
    const LIMIT = limit
    const abovLimit = text?.length > LIMIT
    const dotsOrEmpty = abovLimit ? '...' : " "
    const TEXT_FORMATED = text.substring(0, LIMIT) + dotsOrEmpty
    
    return TEXT_FORMATED
}