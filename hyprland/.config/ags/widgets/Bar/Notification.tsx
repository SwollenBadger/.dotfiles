import AstalNotifd from 'gi://AstalNotifd'
import {bind} from '../../../../../../../../usr/share/astal/gjs/binding'
import {Gtk} from 'astal/gtk3'
import ToggleButton from '../../components/ToggleButton'

const NotificationService = AstalNotifd.get_default()

const Notification = () => {
    const notifications = bind(NotificationService, 'notifications')

    return (
        <ToggleButton className="notification-toggle" valign={Gtk.Align.CENTER}>
            <box className="counter" valign={Gtk.Align.CENTER}>
                <label label="󰂚" className="icon" />
                <label
                    className="count"
                    label={notifications.as((notifications) =>
                        notifications.length > 9
                            ? '9+'
                            : notifications.length.toString(),
                    )}
                />
            </box>
        </ToggleButton>
    )
}
export default Notification
