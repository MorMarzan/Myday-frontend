import { utilService } from '../services/util.service'

export function HighlightText({ text, query }) {
    if (!query) return text
    const escapedQuery = utilService.escapeRegExp(query)
    const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'))

    return (
        parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase()
                ? <span key={index} className="highlight">{part}</span>
                : part
        )
    )
}
