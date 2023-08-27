import { Recipient, Source } from "datasources/base";
import { SupportedFormatter } from "formatter/base";
import { makeAutoObservable } from "mobx";
import config_store from "./config_store";

class RecipientStore {
  loading = true;

  recipients: Recipient[];
  recipient?: Recipient;

  sources: Source[];
  source: Source;

  constructor() {
    makeAutoObservable(this);

    this.recipients = [];
    this.source = SupportedFormatter.Messenger;
    this.sources = [SupportedFormatter.MSN, SupportedFormatter.Messenger];

    this.fetch_recipients();
  }

  set_source(source: Source) {
    this.source = source;
    this.set_recipients([]);
  }

  async fetch_recipients() {
    this.loading = true;

    const recipients =
      await config_store.datasource_instance.retrieveBucketListFromStorage(
        this.source
      );

    this.set_recipients(recipients);
    this.loading = false;
  }

  async delete_recipient(recipient: Recipient) {
    this.loading = true;

    await config_store.datasource_instance.deleteBucketFromStorage(
      recipient,
      this.source
    );

    this.fetch_recipients();
  }

  set_recipient(recipient: Recipient) {
    this.recipient = recipient;
  }

  set_recipients(recipients: Recipient[]) {
    this.recipients = recipients;
  }
}

export default new RecipientStore();
