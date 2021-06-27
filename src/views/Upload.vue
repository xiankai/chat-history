<template>
  <div>This is the chat upload page</div>
  <input type="file" multiple ref="upload" />
</template>

<script>
  export default {
    name: "Upload",
    mounted() {
      const handleFiles = () => {
        const files = this.$refs.upload.files;
        files.forEach((file) => {
          const fr = new FileReader();
          fr.onload = (e) => {
            const { metadata, messages } = this.$formatter.formatChatLog(
              e.target.result.trim()
            );
            const recipient = metadata.participants[1].identifier;
            messages.forEach((chat_line) => {
              const [line_number, timestamp, message, source, source_metadata] =
                chat_line;
              const terms = this.$tokenizer.parseMessage(message);
              this.$datasource.addToIndex(
                { recipient, line_number, timestamp },
                terms
              );
              this.$datasource.addToStorage(
                recipient,
                line_number,
                timestamp,
                message,
                source,
                source_metadata
              );
            });
          };
          fr.readAsText(file);
        });
      };
      this.$refs.upload.addEventListener("change", handleFiles, false);
    },
  };
</script>
