export const DateContainer = ({
  date,
  children,
}: {
  date: Date;
  children: React.ReactNode;
}) => {
  return (
    <div className="">
      <div className="divider">{date.toLocaleString()}</div>
      {children}
    </div>
  );
};
