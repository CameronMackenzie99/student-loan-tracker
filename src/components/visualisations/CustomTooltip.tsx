import type { TooltipProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { formatCurrency } from "../../utils/formatCurrency";

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<string, number>) => {
  if (active) {
    return (
      <div className="custom-tooltip rounded-md bg-gray-500">
        <p className="label">{`${label}`}</p>
        {payload?.map((series) => (
          <p key={series.name} className="label">{`${
            series.name
          } : ${formatCurrency(series.value)}`}</p>
        ))}
      </div>
    );
  }

  return null;
};
