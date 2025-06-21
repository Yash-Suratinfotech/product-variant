import { OptionLayout } from "../../components/options";
import { useParams } from "react-router-dom";

export default function OptionSet() {
  const { id } = useParams();

  return (
    <div>
      <OptionLayout id={id} />
    </div>
  );
}
