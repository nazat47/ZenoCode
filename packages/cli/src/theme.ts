export type ThemeColors = {
  primary: string;
  planMode: string;
  selection: string;
  thinking: string;
  success: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  dialogSurface: string;
  thinkingBorder: string;
  dimSeperator: string;
};

export type Theme = {
  name: string;
  colors: ThemeColors;
};

export const THEMES: Theme[] = [
  {
    name: "Nightfox",
    colors: {
      primary: "#51CF66",
      planMode: "#89B4FA",
      selection: "#38BDF8",
      thinking: "#FACC15",
      success: "#4ADE80",
      error: "#F87171",
      info: "#60A5FA",
      background: "#020617",
      surface: "#0F172A",
      dialogSurface: "#0F172A",
      thinkingBorder: "#FACC15",
      dimSeperator: "#1E293B",
    },
  },
  {
    name: "Catppuccin Mocha",
    colors: {
      primary: "#A6E3A1",
      planMode: "#89B4FA",
      selection: "#74C7EC",
      thinking: "#F9E2AF",
      success: "#A6E3A1",
      error: "#F38BA8",
      info: "#89B4FA",
      background: "#1E1E2E",
      surface: "#313244",
      dialogSurface: "#45475A",
      thinkingBorder: "#F9E2AF",
      dimSeperator: "#585B70",
    },
  },
  {
    name: "Tokyo Night",
    colors: {
      primary: "#9ECE6A",
      planMode: "#7AA2F7",
      selection: "#2AC3DE",
      thinking: "#E0AF68",
      success: "#73DACA",
      error: "#F7768E",
      info: "#7DCFFF",
      background: "#1A1B26",
      surface: "#24283B",
      dialogSurface: "#292E42",
      thinkingBorder: "#E0AF68",
      dimSeperator: "#414868",
    },
  },
  {
    name: "Dracula",
    colors: {
      primary: "#50FA7B",
      planMode: "#BD93F9",
      selection: "#8BE9FD",
      thinking: "#F1FA8C",
      success: "#50FA7B",
      error: "#FF5555",
      info: "#8BE9FD",
      background: "#282A36",
      surface: "#343746",
      dialogSurface: "#44475A",
      thinkingBorder: "#F1FA8C",
      dimSeperator: "#6272A4",
    },
  },
  {
    name: "Nord",
    colors: {
      primary: "#A3BE8C",
      planMode: "#81A1C1",
      selection: "#88C0D0",
      thinking: "#EBCB8B",
      success: "#A3BE8C",
      error: "#BF616A",
      info: "#5E81AC",
      background: "#2E3440",
      surface: "#3B4252",
      dialogSurface: "#434C5E",
      thinkingBorder: "#EBCB8B",
      dimSeperator: "#4C566A",
    },
  },
  {
    name: "Gruvbox Dark",
    colors: {
      primary: "#B8BB26",
      planMode: "#83A598",
      selection: "#458588",
      thinking: "#FABD2F",
      success: "#98971A",
      error: "#FB4934",
      info: "#83A598",
      background: "#282828",
      surface: "#32302F",
      dialogSurface: "#3C3836",
      thinkingBorder: "#FABD2F",
      dimSeperator: "#504945",
    },
  },
  {
    name: "Everforest",
    colors: {
      primary: "#A7C080",
      planMode: "#7FBBB3",
      selection: "#83C092",
      thinking: "#DBBC7F",
      success: "#A7C080",
      error: "#E67E80",
      info: "#7FBBB3",
      background: "#2D353B",
      surface: "#343F44",
      dialogSurface: "#3D484D",
      thinkingBorder: "#DBBC7F",
      dimSeperator: "#475258",
    },
  },
  {
    name: "One Dark",
    colors: {
      primary: "#98C379",
      planMode: "#61AFEF",
      selection: "#56B6C2",
      thinking: "#E5C07B",
      success: "#98C379",
      error: "#E06C75",
      info: "#61AFEF",
      background: "#282C34",
      surface: "#2F333D",
      dialogSurface: "#353B45",
      thinkingBorder: "#E5C07B",
      dimSeperator: "#4B5263",
    },
  },
  {
    name: "Solarized Dark",
    colors: {
      primary: "#859900",
      planMode: "#268BD2",
      selection: "#2AA198",
      thinking: "#B58900",
      success: "#859900",
      error: "#DC322F",
      info: "#268BD2",
      background: "#002B36",
      surface: "#073642",
      dialogSurface: "#0A4A58",
      thinkingBorder: "#B58900",
      dimSeperator: "#586E75",
    },
  },
  {
    name: "Rose Pine",
    colors: {
      primary: "#9CCFD8",
      planMode: "#C4A7E7",
      selection: "#EBBCBA",
      thinking: "#F6C177",
      success: "#31748F",
      error: "#EB6F92",
      info: "#9CCFD8",
      background: "#191724",
      surface: "#1F1D2E",
      dialogSurface: "#26233A",
      thinkingBorder: "#F6C177",
      dimSeperator: "#403D52",
    },
  },
  {
    name: "GitHub Dark",
    colors: {
      primary: "#3FB950",
      planMode: "#58A6FF",
      selection: "#79C0FF",
      thinking: "#D29922",
      success: "#3FB950",
      error: "#F85149",
      info: "#58A6FF",
      background: "#0D1117",
      surface: "#161B22",
      dialogSurface: "#21262D",
      thinkingBorder: "#D29922",
      dimSeperator: "#30363D",
    },
  },
];

export const DEFAULT_THEME = THEMES.find((t) => t.name === "Nightfox")!;
