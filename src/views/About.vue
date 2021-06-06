<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div markdown="1">
      # What
      An app for you to store your chat histories from different applications in one place.

      # Why
      Chat applications, like social media sites, rise and fall with the the advent of their popularity, the company hosting them, and many other factors.
      Unfortunately for us consumers, such information is kept in corporate silos at the whim of their stock price.
      Sometimes when sunsetting a chat app, they offer chat log dumps. But those can be impracticable to search through.

      # How
      ## Input
      It takes the log files that you provide and a line format to help it parse the logs.
      ## Tokenization
      To cater to future inputs, it uses a simple whitespace delimited method for indexing messages.
      ## Indexing
      The chat log files are stored in CSV format, with the first 4 columns being timestamp, message, source and source metadata.
      ## File structure
      The files are split by day, and grouped into year and month buckets.
      ## Searching
      It has 3 main different sources of data
      1. The log files you upload in this session.
      2. The indexed chat data that you have already uploaded before.
      3. Third-party chat history APIs that you have authenticated with.
      ## Viewing
      It will be in typical chat app form, and searching will make you jump to the particular timestamp.
      Should also support calendar view.

    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>
