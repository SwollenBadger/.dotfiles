import {Variable} from '../../../../../../../../usr/share/astal/gjs'
import ToggleButton from '../../components/ToggleButton'

export const menuState = Variable(false)
export const setMenuState = (menu_state?: boolean) =>
    menuState.set(!menu_state ? !menuState.get() : menu_state)

const Menu = () => {
    return (
        <ToggleButton
            onClick={() => setMenuState()}
            state={menuState()}
            className="menu-button"
        >
            
        </ToggleButton>
    )
}

export default Menu
