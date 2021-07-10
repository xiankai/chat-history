import { useState } from 'react';
import { datasource, ViewerComponent } from '../config';
import { List } from '../components/List';
import { DatePicker } from '../components/DatePicker';

export const Viewer = () => {
  const recipients = datasource.retrieveBucketListFromStorage();
  const [recipient, select_recipient] = useState('alejandro_1701@hotmail.com');

  const [date, select_date] = useState(new Date('2008-11-06'));
  const logs = datasource.retrieveBucketFromStorage(recipient, {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate() + 1,
  });

  return (
    <>
      <h1>This is the chat history page</h1>
      <List
        items={recipients}
        selected_item={recipient}
        select_item={select_recipient}
      />
      <DatePicker date={date} select_date={select_date} />
      <ViewerComponent
        logs={logs}
        recipient={recipient}
        date={date.toDateString()}
      />
    </>
  );
};
