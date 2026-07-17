import { DialogProvider } from "../../providers/dialog";
import { KeyboardLayerProvider } from "../../providers/keyboard-layer";
import { PromptConfigProvider } from "../../providers/prompt-config";
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
            <PromptConfigProvider>
              <ThemeRoot>
                <Outlet />
              </ThemeRoot>
            </PromptConfigProvider>
          </DialogProvider>
        </KeyboardLayerProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
