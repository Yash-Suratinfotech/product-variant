import { OptionLayout } from "../../components/options";
import { OptionSetProvider } from "../../components";
import { useParams } from "react-router-dom";

export default function OptionSet() {
  const { id } = useParams();

  return (
    <div>
      <OptionSetProvider>
        <OptionLayout id={id} />
      </OptionSetProvider>
    </div>
  );
}
