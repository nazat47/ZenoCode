import { DialogProvider } from "../../providers/dialog";
import { KeyboardLayerProvider } from "../../providers/keyboard-layer";
import { ThemeProvider } from "../../providers/theme";
import { ToastProvider } from "../../providers/toast";
import { ThemeRoot } from "./themed-root";
import { Outlet } from "react-router";

export function RootLayout() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <KeyboardLayerProvider>
          <DialogProvider>
            <ThemeRoot>
              <Outlet />
            </ThemeRoot>
          </DialogProvider>
        </KeyboardLayerProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
