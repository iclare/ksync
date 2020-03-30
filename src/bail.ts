import log from './log';

function bail(error: any) {
  log.error(error);
  process.exit(1);
}

export default bail;
