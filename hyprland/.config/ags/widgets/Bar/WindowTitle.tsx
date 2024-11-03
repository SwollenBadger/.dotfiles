import AstalHyprland from 'gi://AstalHyprland'
import {bind} from '../../../../../../../../usr/share/astal/gjs/binding'
const HyprlandService = AstalHyprland.get_default()

const WindowTitle = () => {
    return (
        <box className="window-title">
            <label className="icon" label="" />
            <label
                className="title"
                truncate={true}
                maxWidthChars={25}
                label={bind(HyprlandService, 'focusedClient').as(
                    (focused_client) =>
                        `${focused_client !== null ? focused_client.title[0].toUpperCase() + focused_client.title.slice(1) : '~'}`,
                )}
            />
        </box>
    )
}

export default WindowTitle
