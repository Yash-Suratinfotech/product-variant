import { OptionLayout } from "../../components/options";
import { OptionSetProvider } from "../../components";

export default function OptionSet() {
  return (
    <div>
      <OptionSetProvider>
        <OptionLayout />
      </OptionSetProvider>
    </div>
  );
}
