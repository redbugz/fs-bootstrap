// Rudimentary profiling object
module.exports = function(out) {
  return function(req, res, next) {
    var track = (req.url === '/'),
        snapshot = {},
        end = res.end;

    if(track) {
      snapshot = {
        url: req.url,
        start: new Date(),
        mem: process.memoryUsage()
      }

      // proxy res.end()
      res.end = function(data, encoding) {
        res.end = end;
        res.end(data, encoding);

        snapshot.stop = new Date();
        snapshot.time = snapshot.stop - snapshot.start;
        snapshot.mem.heapTotalTxt = formatBytes(snapshot.mem.heapTotal);
        snapshot.mem.vsizeTxt = formatBytes(snapshot.mem.vsize);
        snapshot.mem.heapUsedTxt = formatBytes(snapshot.mem.heapUsed);
        snapshot.mem.rssTxt = formatBytes(snapshot.mem.rss);
        out(snapshot);
      }
    }

    next();
  }
};

/**
 * Format byte-size.
 *
 * @param {Number} bytes
 * @return {String}
 * @api private
 */

function formatBytes(bytes) {
  var kb = 1024
    , mb = 1024 * kb
    , gb = 1024 * mb;
  if (bytes < kb) return bytes + 'b';
  if (bytes < mb) return (bytes / kb).toFixed(2) + 'kb';
  if (bytes < gb) return (bytes / mb).toFixed(2) + 'mb';
  return (bytes / gb).toFixed(2) + 'gb';
};