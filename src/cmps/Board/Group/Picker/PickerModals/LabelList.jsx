import { PlusIcon } from "../../../../../services/svg.service"
import { LabelPickerPreview } from "./LabelPickerPreview"

export function LabelList({ labels, handleChange, isEditing, onLabelsChange, onAddLabel, onRemoveLabel }) {

    return (
        <ul className='clean-list manual-select label-list'>
            {labels.map(label => (
                <LabelPickerPreview
                    label={label}
                    handleChange={handleChange}
                    isEditing={isEditing}
                    onLabelsChange={onLabelsChange}
                    onRemoveLabel={onRemoveLabel}
                    key={label.id}
                />
            ))}

            {isEditing && <li>
                <button
                    className="btn full-width flex align-center justify-center add-label-btn"
                    onClick={onAddLabel}>
                    <PlusIcon />
                    <p className="flex align-center justify-center">Add Label</p>
                </button>
            </li>}
        </ul>
    )
}

