/* Pengganti kecil untuk API "dash" milik dashboard Claude, supaya halaman notes jalan sebagai situs statis (GitHub Pages). */
(function () {
  var DATA = window.DASH_DATA || {};
  var calcs = {}, cbs = [], params = { creator: null };
  function rowsOf(id) {
    if (calcs[id]) {
      var c = calcs[id];
      try { return { status: 'ok', data: c.fn.apply(null, c.inputs.map(function (i) { return rowsOf(i).data; })) }; }
      catch (e) { return { status: 'error', data: [], message: String(e) }; }
    }
    var d = DATA[id];
    if (!d) return { status: 'missing', data: [] };
    return { status: 'ok', data: d, rows: d, columns: d.length ? Object.keys(d[0]) : [], meta: [] };
  }
  function run() { cbs.forEach(function (f) { try { f(); } catch (e) { console.error(e); } }); }
  var t;
  window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(run, 120); });
  window.dash = {
    data: rowsOf,
    calc: function (id, o) { calcs[id] = o; },
    loader: function () {},
    onData: function (fn) { cbs.push(fn); try { fn(); } catch (e) { console.error(e); } },
    params: function () { return params; },
    setParams: function (p) { for (var k in p) params[k] = p[k]; run(); },
    resetParams: function () { params = { creator: null }; run(); },
    setLink: function (name) { try { history.replaceState(null, '', '#' + name); } catch (e) {} },
    refresh: function () {},
    colors: ['#2F7D5B', '#0B3B2E', '#FFC22E', '#E5492A', '#E5492A', '#5B6B5F', '#C9AE90', '#FFD3A5']
  };
})();
