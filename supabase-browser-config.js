(function () {
  if (window.radarSupabaseConfig) return;
  if (['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)) {
    window.radarSupabaseConfig = {
      url: 'https://tocyvysucpslayzglixq.supabase.co',
      key: 'sb_publishable_8mKUf28dbMM8EOSPrgjRUA_19taJmrT'
    };
  }
})();
