module.exports = {
    getOptionArgs() {
      const args = process.argv.slice(2);
      const optionsTable = {};

      for (let i = 0; i < args.length; i++) {
        if (args[i].startsWith('-')) {
          const key = args[i].substring(1);
          let value = args[i + 1] || null; // needs to be null instead of undefined in order to be json parsed

          optionsTable[key] = JSON.parse(value) || true;
        }
      }

      return optionsTable;
    }
};