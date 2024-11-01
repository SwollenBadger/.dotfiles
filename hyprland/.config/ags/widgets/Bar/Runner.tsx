import {execAsync} from '../../../../../../../../usr/share/astal/gjs/process'
import ToggleButton from '../../components/ToggleButton'

const Runner = () => {
    return (
        <ToggleButton
            className="runner"
            onClick={() =>
                execAsync(['bash', '-c', 'killall anyrun || anyrun'])
            }
        >
            
        </ToggleButton>
    )
}

export default Runner
