
import { ColorPicker } from "./Board/Group/Picker/PickerModals/ColorPicker"
import { MemberPicker } from "./Board/Group/Picker/PickerModals/MemberPicker"
import { LabelPicker } from "./Board/Group/Picker/PickerModals/LabelPicker"
import { DatePicker } from "./Board/Group/Picker/PickerModals/DatePicker"
import { LinkPicker } from "./Board/Group/Picker/PickerModals/LinkPicker"
import { MenuOptionsModal } from "./MenuOptionsModal"
import { FilePicker } from "./Board/Group/Picker/PickerModals/FilePicker"
import { Tooltip } from "./Tooltip"
import { SortPicker } from "./Board/SortPicker"
import BoardMemberSelect from "./Board/BoardMemberSelect"

export function DynamicModalRouter(props) {
    switch (props.type) {
        case 'colorPicker':
            return (
                <ColorPicker
                    colors={props.data.colors}
                    onColorClick={props.data.onColorClick}
                />)

        case 'datePicker':
            return (
                <DatePicker
                    selectedDate={props.data.selectedDate}
                    onUpdate={props.data.onUpdate}
                />)

        case 'labelPicker':
            return (
                <LabelPicker
                    selectedStatus={props.data.selectedStatus}
                    title={props.data.title}
                    onChangeStatus={props.data.onUpdate}
                />)

        case 'linkPicker':
            return (
                <LinkPicker
                    url={props.data.url}
                    displayTxt={props.data.displayTxt}
                    changeLink={props.data.onChangeLink}
                />)

        case 'filePicker':
            return (
                <FilePicker
                    chosenFile={props.data.chosenFile}
                    changeFile={props.data.onChangeFile}
                    taskId={props.data.taskId}
                />)

        case 'memberPicker':
            return (
                <MemberPicker
                    chosenMembers={props.data.chosenMembers}
                    allMembers={props.data.allMembers}
                    onChangeMembers={props.data.onChangeMembers}
                />)

        case 'menuOptions':
            return <MenuOptionsModal options={props.data.options} />

        case 'tooltip':
            return <Tooltip txt={props.data.txt} />

        case 'boardMemberSelect':
            return <BoardMemberSelect chosenMember={props.data.chosenMember} members={props.data.members} onChangeMember={props.data.onChangeMember} />

        case 'sortPicker':
            return <SortPicker isIntialSortEmpty={props.data.isIntialSortEmpty} />
    }
}