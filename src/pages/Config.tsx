import { observer } from "mobx-react-lite";
import config_store, { ConfigFormat } from "stores/config_store";

const Button = ({
  data_key,
  label,
  tooltip,
  active,
  on_click,
}: ConfigFormat & {
  active: boolean;
  on_click: () => void;
}) => (
  <button
    className={`btn ${active ? "btn-active" : ""} tooltip`}
    onClick={on_click}
    data-tip={tooltip}
  >
    {label}
  </button>
);

export const Config = observer(() => {
  return (
    <div>
      <div>
        <label className="label">Tokenizer strategy</label>
        <div className="btn-group">
          {config_store.tokenizers.map((tokenizer) => (
            <Button
              key={tokenizer.data_key}
              {...tokenizer}
              active={config_store.tokenizer === tokenizer.data_key}
              on_click={() => (config_store.tokenizer = tokenizer.data_key)}
            />
          ))}
        </div>
      </div>
      <div>
        <label className="label">Data storage location</label>
        <div className="btn-group">
          {config_store.datasources.map((datasource) => (
            <Button
              key={datasource.data_key}
              {...datasource}
              active={config_store.datasource === datasource.data_key}
              on_click={() => (config_store.datasource = datasource.data_key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
