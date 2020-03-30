import chalk from 'chalk';

function error(err: any) {
  const error = err.error || err;
  const name = `${error.name ? error.name + ': ' : ''}`;
  const message = `${name}${error.message || error}`;

  console.error(chalk`{red ${message}}`);

  if (!__DEV__) return;

  if (error.loc) {
    console.error(`at ${error.loc.file}:${error.loc.line}:${error.loc.column}`);
  }

  if (error.frame) {
    console.error(chalk`{dim ${error.frame}}`);
  } else if (err.stack) {
    const headlessStack = error.stack.replace(message, '').trim();
    console.error(chalk`{dim ${headlessStack}}`);
  }
}

function call(message?: any) {
  console.log(`${message ?? ''}`);
}

const log = Object.assign(call, { error });

export default log;
