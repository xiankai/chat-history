export type ListProps<T> = {
  selected_item: T;
  items: T[];
  select_item: (item: T) => void;
};

export const List = <T extends string>(props: ListProps<T>) => {
  const handle_click = (item: T) => () => props.select_item(item);

  return (
    <ul>
      {props.items.map((item) => (
        <li
          key={item}
          onClick={handle_click(item)}
          className={item === props.selected_item ? 'text-red-500' : ''}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};
