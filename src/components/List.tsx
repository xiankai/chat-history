export const List = ({ selected_item, items, select_item }) => {
  return (
    <ul>
      {items.map((item) => (
        <li
          key={item}
          onClick={select_item(item)}
          className={item === selected_item ? 'text-red-500' : ''}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};
