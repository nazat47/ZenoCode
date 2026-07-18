import { Mode } from "@zenocode/database/enums";
import { useTheme } from "../../providers/theme";

const UserMessage = ({ message, mode }: { message: string; mode: Mode }) => {
  const { colors } = useTheme();
  return (
    <box width={"100%"} alignItems="center">
      <box
        border={["left"]}
        borderColor={mode === Mode.PLAN ? colors.planMode : colors.primary}
        width={"100%"}
      >
        <box
          justifyContent="center"
          paddingX={2}
          paddingY={1}
          backgroundColor={colors.surface}
          width={"100%"}
        >
          <text>{message}</text>
        </box>
      </box>
    </box>
  );
};

export { UserMessage };
