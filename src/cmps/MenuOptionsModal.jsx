
export function MenuOptionsModal({ options }) {
    return (
        <div className="general-modal menu-option-modal">
            {options.map((option, idx) => {
                return (
                    <div key={idx} className="btn" onClick={option.onOptionClick}>
                        {option.icon}
                        <p>{option.title}</p>
                    </div>
                )
            })}
        </div>
    )
}
