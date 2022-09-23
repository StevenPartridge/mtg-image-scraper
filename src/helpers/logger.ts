class Logger {
    progressTime: number = 0;
    timeout: NodeJS.Timeout | null = null;
  
    printProgress(message: string) {
      const loadAnimCharacter = [
        '.     ',
        '..    ',
        '...   ',
        '....  ',
        '..... ',
        '......',
        '..... ',
        '....  ',
        '...   ',
        '..    ',
        '.     ',
      ][this.progressTime++ % 11];
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(`${loadAnimCharacter} ${message}`);
      if(this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => this.printProgress(message), 100);
    }
  
    stopProgress() {
      if(this.timeout) {
        clearTimeout(this.timeout);
      }
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
    }
  
    log(message: string) {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      console.log(message);
    }
  }
  
  export default new Logger();