import {App, Astal, Gdk, Gtk} from 'astal/gtk3'
import Battery from './Battery'
import Calendar from './DateTime'
import Menu from './Menu'
import Notification from './Notification'
import Runner from './Runner'
import SystemInfo from './SystemInfo'
import SystemTray from './SystemTray'
import WindowTitle from './WindowTitle'
import Workspace from './workspace'
import QuickControl from './QuickControl'

function BarPanel(monitor: Gdk.Monitor) {
    return (
        <window
            gdkmonitor={monitor}
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            anchor={
                Astal.WindowAnchor.TOP |
                Astal.WindowAnchor.LEFT |
                Astal.WindowAnchor.RIGHT
            }
            application={App}
            layer={Astal.Layer.BOTTOM}
        >
            <centerbox className="bar">
                <box halign={Gtk.Align.START}>
                    <Menu />
                    <SystemInfo />
                    <WindowTitle />
                </box>
                <box halign={Gtk.Align.CENTER}>
                    <SystemTray />
                    <Workspace />
                    <Notification />
                </box>
                <box halign={Gtk.Align.END}>
                    <QuickControl />
                    <Runner />
                    <Battery />
                    <Calendar />
                </box>
            </centerbox>
        </window>
    )
}

export default function Bar() {
    const bars = new Map<Gdk.Monitor, Gtk.Widget>()

    // initialize
    for (const gdkmonitor of App.get_monitors()) {
        bars.set(gdkmonitor, BarPanel(gdkmonitor))
    }

    App.connect('monitor-added', (_, gdkmonitor) => {
        bars.set(gdkmonitor, BarPanel(gdkmonitor))
    })

    App.connect('monitor-removed', (_, gdkmonitor) => {
        bars.get(gdkmonitor)?.destroy()
        bars.delete(gdkmonitor)
    })
}
