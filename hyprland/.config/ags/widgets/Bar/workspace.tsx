import {Gtk} from 'astal/gtk3'
import AstalHyprland from 'gi://AstalHyprland'
import {bind} from '../../../../../../../../usr/share/astal/gjs/binding'
import {execAsync} from '../../../../../../../../usr/share/astal/gjs/process'
import GLib from 'gi://GLib'

const HyprlandService = AstalHyprland.get_default()

const workspaces = new Map([
    ['files', 1],
    ['dev', 2],
    ['wbrowser', 3],
    ['term', 4],
    ['design', 5],
    ['office', 6],
    ['it', 7],
    ['misc', 8],
])

const WorkspaceItem = (name: string, id: number) => {
    const focusedWorkspace = bind(HyprlandService, 'focusedWorkspace')
    const clients = bind(HyprlandService, 'clients')

    return (
        <button
            className="item"
            onClick={() => {
                execAsync([
                    'bash',
                    '-c',
                    `${GLib.getenv('HOME')}/.scripts/hypr_workspace toworkspace ${id}`,
                ])
            }}
            setup={(self) => {
                self.toggleClassName(
                    'focused',
                    focusedWorkspace.get().name.trim() === name,
                )
                self.toggleClassName(
                    'occupied',
                    clients
                        .get()
                        .filter(
                            (client: AstalHyprland.Client) =>
                                client.workspace.name.trim() === name,
                        ).length > 0,
                )
                self.hook(focusedWorkspace, (self, workspace) => {
                    self.toggleClassName(
                        'focused',
                        workspace.name.trim() === name,
                    )
                })
                self.hook(clients, (self, clients) => {
                    const clientsWorkspace = clients.filter(
                        (client: AstalHyprland.Client) =>
                            client.workspace.name.trim() === name,
                    )
                    self.toggleClassName(
                        'occupied',
                        clientsWorkspace.length > 0,
                    )
                })
            }}
        >
            {id}
        </button>
    )
}

const Workspace = () => {
    const workspaceItems = []

    for (const [name, id] of workspaces.entries()) {
        workspaceItems.push(WorkspaceItem(name, id))
    }

    return (
        <box className="workspaces" valign={Gtk.Align.CENTER}>
            {workspaceItems}
        </box>
    )
}

export default Workspace
