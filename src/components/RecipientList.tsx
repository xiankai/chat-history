import { stringToColor } from "utils/string";

export type RecipientListProps<T> = {
  selected_item: T;
  items: T[];
  select_item: (item: T) => void;
  delete_item?: (item: T) => void;
};

export const RecipientList = <T extends string>(
  props: RecipientListProps<T>
) => {
  const handle_click = (item: T) => () => props.select_item(item);

  return (
    <ul className="menu">
      {props.items.map((item) => (
        <li key={item} onClick={handle_click(item)} className={`flex flex-row`}>
          <a
            className={`
            w-[80%] rounded-t
            ${item === props.selected_item ? "active" : ""}
          `}
          >
            <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="24" fill={stringToColor(item)} />
            </svg>
            <div>
              <strong>{item}</strong>
            </div>
            {props.delete_item && (
              <span
                className="btn btn-link btn-sm text-white"
                onClick={() => props.delete_item(item)}
              >
                <i className="icon icon-cross"></i>
                Delete
              </span>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
};
