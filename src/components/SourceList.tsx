import { observer } from "mobx-react-lite";
import config_store from "stores/config_store";
import recipient_store from "stores/recipient_store";

export const SourceList = observer(() => {
  return (
    <>
      {config_store.get_formatters().map((formatter) => (
        <div
          key={formatter.value}
          className={`tab tab-lifted tab-lg ${
            formatter.value === recipient_store.source ? "tab-active" : ""
          }`}
          onClick={() => {
            recipient_store.set_source(formatter.value);
            recipient_store.fetch_recipients();
          }}
        >
          {formatter.label}
        </div>
      ))}
    </>
  );
});
