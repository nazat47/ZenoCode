import { useCallback, useEffect, useRef } from "react";
import { useDialog } from "../../providers/dialog";
import { useTheme } from "../../providers/theme";
import { THEMES, type Theme } from "../../theme";
import DialogSearchList from "../dialog-search-list";

export const ThemeDialogContent = () => {
  const dialog = useDialog();
  const { currentTheme, setTheme } = useTheme();
  const originalThemeRef = useRef(currentTheme);
  const confirmedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (!confirmedRef.current) {
        setTheme(originalThemeRef.current);
      }
    };
  }, [setTheme]);

  const handleSelect = useCallback(
    (theme: Theme) => {
      confirmedRef.current = true;
      setTheme(theme);
      dialog.close();
    },
    [setTheme, dialog],
  );

  const handleHighlight = useCallback(
    (theme: Theme) => {
      setTheme(theme);
    },
    [setTheme],
  );

  return (
    <DialogSearchList
      items={THEMES}
      onSelect={handleSelect}
      onHighlight={handleHighlight}
      filterFn={(t, query) =>
        t.name.toLowerCase().includes(query.toLowerCase())
      }
      renderItem={(theme, isSelected) => (
        <text selectable={false} fg={isSelected ? "black" : "white"}>
          {theme.name === originalThemeRef.current.name ? "[✓]" : ""}{" "}
          {theme.name}
        </text>
      )}
      getKey={(t) => t.name}
      placeHolder="Search themes"
      emptyText="No matching themes."
    />
  );
};
