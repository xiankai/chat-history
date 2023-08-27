import { observer } from "mobx-react-lite";
import recipient_store from "stores/recipient_store";
import { stringToColor } from "utils/string";
import { Loading } from "./Loading";

type RecipientListProps = {
  select_recipient_callback?: (recipient: string) => void;
};

export const RecipientList = observer((props: RecipientListProps) => {
  return (
    <ul className="menu">
      {recipient_store.loading && <Loading />}
      {!recipient_store.loading &&
        recipient_store.recipients.length === 0 &&
        "No contact history found."}
      {!recipient_store.loading &&
        recipient_store.recipients.map((recipient) => (
          <li
            key={recipient}
            onClick={() => {
              if (recipient === recipient_store.recipient) return;

              props.select_recipient_callback?.(recipient);
              recipient_store.set_recipient(recipient);
            }}
            className={`flex flex-row`}
          >
            <a
              className={`
            w-[80%] rounded-t
            ${recipient === recipient_store.recipient ? "active" : ""}
          `}
            >
              <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
                <circle
                  cx="24"
                  cy="24"
                  r="24"
                  fill={stringToColor(recipient)}
                />
              </svg>
              <div>
                <strong>{recipient}</strong>
              </div>
              <span
                className="btn btn-link btn-sm text-white"
                onClick={(e) => {
                  if (!window.confirm(`Delete ${recipient}?`)) {
                    return;
                  }
                  e.stopPropagation();
                  recipient_store.delete_recipient(recipient);
                }}
              >
                <i className="icon icon-cross"></i>
                Delete
              </span>
            </a>
          </li>
        ))}
    </ul>
  );
});
