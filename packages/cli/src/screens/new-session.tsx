import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useTheme } from "../providers/theme";
import SessionShell from "../components/session-shell";
import { BotMessage, ErrorMessage, UserMessage } from "../components/message";

const NewSession = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const location = useLocation();

  const state = location.state as { message?: string } | null;

  useEffect(() => {
    if (!state?.message) {
      navigate("/", { replace: true });
    }
  }, [state, navigate]);

  if (!state?.message) return null;

  return (
    <SessionShell onSubmit={() => {}} inputDisabled loading>
      <UserMessage message={state.message} />
      <BotMessage
        model="gpt-5-mini"
        content="This is a simple test to make sure it works"
      />
      <ErrorMessage message="Oops!" />
    </SessionShell>
  );
};

export default NewSession;
