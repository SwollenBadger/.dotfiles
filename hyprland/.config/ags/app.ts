import {App} from 'astal/gtk3'
import style from './style.scss'
import Bar from './widgets/Bar/Main'

App.start({
    css: style,
    instanceName: 'widget_shell',
    main() {
        Bar()
    },
})
