import "opentui-spinner/react";
import { useTheme } from "../providers/theme";

const Spinner = () => {
  const { colors } = useTheme();

  return <spinner name="dots" color={colors.primary} />;
};

export default Spinner;
