<template>
    <div>This is the chat upload page</div>
    <input type="file" multiple ref="upload" />
</template>

<script>
export default {
  name: 'Upload',
  // components: {
  //   Upload
  // }
  mounted() {
    const handleFiles = () => {
      const files = this.$refs.upload.files
      console.log('handling', files);
      files.forEach(file => {
        const fr = new FileReader();
        fr.onload = e => {
          const lines = e.target.result.split('\n');
          for (let i in lines) {
            if (i < this.$formatter.offset()) continue;
            const line = lines[i];
            try {
              const [line_number, timestamp, message, source, source_metadata] = this.$formatter.formatMessage(i, line);
              const terms = this.$tokenizer.parseMessage(message);
              this.$datasource.addToIndex(line_number, timestamp, terms);
              this.$datasource.addToStorage(line_number, timestamp, message, source, source_metadata);
            } catch (e) {
              console.log('Unable to parse', line);
              console.error(e);
            }
          }
        };
        fr.readAsText(file);
      });
    };
    this.$refs.upload.addEventListener('change', handleFiles, false);
  },
}
</script>
