import "opentui-spinner/react";
import { useTheme } from "../providers/theme";
import { Mode } from "@zenocode/database/enums";

const Spinner = ({ mode = Mode.BUILD }: { mode?: Mode }) => {
  const { colors } = useTheme();
  const activeColor = mode === Mode.BUILD ? colors.primary : colors.planMode;

  return <spinner name="aesthetic" color={activeColor} />;
};

export default Spinner;
