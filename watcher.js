const events = require("events");
const fs = require("fs");
const bf = require('buffer');
const TRAILING_LINES = 10;
const buffer = new Buffer.alloc(bf.constants.MAX_STRING_LENGTH);

class Watcher extends events.EventEmitter {
  constructor(watchFile) {
    super();
    this.watchFile = watchFile;
    this.store = [];
    this.partialLine = ''; // This is for the incomplete line i.e when we stoppd without going to the next line
  }
  getLogs() {
    return this.store;
  }

  watch(curr, prev) {
    const watcher = this;
    fs.open(this.watchFile, (err, fd) => {
      if (err) throw err;
      let data = '';
      let logs = [];
      fs.read(fd, buffer, 0, buffer.length, prev.size, (err, bytesRead) => {
        if (err) throw err;
        if (bytesRead > 0) {
          data = this.partialLine + buffer.slice(0, bytesRead).toString(); // Prepend partial line to data
          logs = data.split("\n");
          
          // Check if the last character is a newline character
          if (data[data.length - 1] !== '\n') {
            // if not,  the last line is still in progress and should be stored as partialLine
            this.partialLine = logs.pop();
          } else {
            // If the data ends with a newline character, make partialLine back to empty
            this.partialLine = '';
          }

          logs = logs.filter(line => line.trim()); // Filter out empty lines
          console.log("logs read:" + logs);
          
          // Update the store with the new logs, keeping only the last TRAILING_LINES
          this.store = [...this.store, ...logs].slice(-TRAILING_LINES);
          
          watcher.emit("modified-logs", logs);
        }
        fs.close(fd, (err) => {
          if (err) console.error('Error closing file', err);
        });
      });
    });
  }

  start() {
    var watcher = this;
    // we can reduce the below time for more close real-time tracking
    fs.watchFile(this.watchFile, { "interval": 100 }, function (curr, prev) {
      watcher.watch(curr, prev);
    });
  }

  stop()
  {
    fs.unwatchFile(this.watchFile);
    console.log("Unwatched this File");
    
  }
}

module.exports = Watcher;