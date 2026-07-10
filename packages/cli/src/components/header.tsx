export function Header() {
    return <box alignItems="center" justifyContent="center" >
        <box flexDirection="row" justifyContent="center" alignItems="center" gap={0.5}>
            <ascii-font font="tiny" text="Zeno" color="gray" />
            <ascii-font font="tiny" text="Code" />
        </box>
    </box>
}