import { Automation } from "./Automation"

export function AutomationList({ automations, isDisabled, handleSwitchChange }) {
    return (
        <ul className="clean-list automation-list">
            {automations.map((automation, idx) => {
                return (
                    <Automation
                        automation={automation}
                        isDisabled={isDisabled}
                        handleSwitchChange={handleSwitchChange}
                        key={idx}
                    />
                )
            })}
        </ul>
    )
}
