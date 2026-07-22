import "opentui-spinner/react";
import { useTheme } from "../providers/theme";
import { type ModeType, Mode } from "@zenocode/shared";

const Spinner = ({ mode = Mode.BUILD }: { mode?: ModeType }) => {
  const { colors } = useTheme();
  const activeColor = mode === Mode.BUILD ? colors.primary : colors.planMode;

  return <spinner name="aesthetic" color={activeColor} />;
};

export default Spinner;
