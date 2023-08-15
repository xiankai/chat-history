import ConfigStore from "stores/config_store";
import { SupportedFormatter } from "formatter/base";

export type SourceListProps = {
  selected_item: SupportedFormatter;
  select_item: (item: SupportedFormatter) => void;
};

export const SourceList = ({ selected_item, select_item }: SourceListProps) => {
  return (
    <>
      {ConfigStore.get_formatters().map((formatter) => (
        <div
          key={formatter.value}
          className={`tab tab-lifted tab-lg ${
            formatter.value === selected_item ? "tab-active" : ""
          }`}
          onClick={() => select_item(formatter.value)}
        >
          {formatter.label}
        </div>
      ))}
    </>
  );
};
