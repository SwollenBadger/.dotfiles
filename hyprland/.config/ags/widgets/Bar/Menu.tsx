import {Gtk} from 'astal/gtk3'
import ToggleButton from '../../components/ToggleButton'

const Menu = () => {
    return (
        <ToggleButton
            vexpand={true}
            hexpand={true}
            valign={Gtk.Align.CENTER}
            halign={Gtk.Align.CENTER}
            className="menu-button"
        >
            
        </ToggleButton>
    )
}

export default Menu
