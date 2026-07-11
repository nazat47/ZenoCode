import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { Header } from "./components/header";
import { InputBar } from "./components/input-bar";

function App() {
  return (
    <box
      alignItems="center"
      justifyContent="center"
      backgroundColor={"#0D0D12"}
      width={"100%"}
      height={"100%"}
      gap={2}
    >
      <Header />
      <box width={"100%"}>
        <InputBar onSubmit={() => {}} />
      </box>
    </box>
  );
}

const renderer = await createCliRenderer({
  exitOnCtrlC: false,
  targetFps: 60,
});
createRoot(renderer).render(<App />);
