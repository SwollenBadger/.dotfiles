import AstalTray from 'gi://AstalTray'
import {bind} from '../../../../../../../../usr/share/astal/gjs/binding'
import {Gdk, Gtk} from 'astal/gtk3'
import Variable from '../../../../../../../../usr/share/astal/gjs/variable'
import {trayItemShownIds} from '../../lib/Variables'
import ToggleButton from '../../components/ToggleButton'

const TrayServices = AstalTray.get_default()

const Item = ({item}: {item: AstalTray.TrayItem}) => {
    const menu = item.create_menu()

    return (
        <ToggleButton
            className="item"
            tooltipText={bind(item, 'tooltipMarkup')}
            onDestroy={() => menu?.destroy}
            valign={Gtk.Align.CENTER}
            onClick={(self) => {
                menu?.popup_at_widget(
                    self,
                    Gdk.Gravity.SOUTH,
                    Gdk.Gravity.NORTH,
                    null,
                )
            }}
        >
            <icon icon={bind(item, 'iconName')} />
        </ToggleButton>
    )
}

const SystemTray = () => {
    const trayItems = bind(TrayServices, 'items')

    const shownTrayItems = trayItems.as((ti) => {
        return ti.filter((item) =>
            trayItemShownIds.includes(item.id.toLowerCase()),
        )
    })

    return (
        <box
            className="tray-toggle"
            visible={trayItems.as((ti) => ti.length > 0)}
            valign={Gtk.Align.CENTER}
        >
            <ToggleButton className="toggle" valign={Gtk.Align.CENTER}>
                
            </ToggleButton>
            {bind(
                Variable.derive([trayItems, shownTrayItems], (ti, sti) => {
                    if (sti.length <= 0) {
                        return ti
                            .slice(0, 3)
                            .map((item) => <Item item={item} />)
                    }

                    return sti.map((item) => <Item item={item} />)
                }),
            )}
        </box>
    )
}

export default SystemTray
