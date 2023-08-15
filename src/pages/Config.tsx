import { observer } from "mobx-react-lite";
import ConfigStore, { ConfigFormat } from "stores/config_store";

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
          {ConfigStore.tokenizers.map((tokenizer) => (
            <Button
              key={tokenizer.data_key}
              {...tokenizer}
              active={ConfigStore.tokenizer === tokenizer.data_key}
              on_click={() => (ConfigStore.tokenizer = tokenizer.data_key)}
            />
          ))}
        </div>
      </div>
      <div>
        <label className="label">Data storage location</label>
        <div className="btn-group">
          {ConfigStore.datasources.map((datasource) => (
            <Button
              key={datasource.data_key}
              {...datasource}
              active={ConfigStore.datasource === datasource.data_key}
              on_click={() => (ConfigStore.datasource = datasource.data_key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
