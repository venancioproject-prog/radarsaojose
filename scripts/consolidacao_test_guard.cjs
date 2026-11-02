// Testes antigos podem exportar sobre auditorias anteriores: redirecionar saídas.
const fs = require('node:fs');
const path = require('node:path');
const root=path.resolve(__dirname,'..');
const base=path.join(root,'docs','dados-publicos-revisao');
const out=process.env.RADAR_CONSOLIDACAO_TEST_OUT;
if(!out)throw Error('RADAR_CONSOLIDACAO_TEST_OUT obrigatório');
const write=fs.writeFileSync.bind(fs);
fs.writeFileSync=function(p,...args){
 const full=path.resolve(String(p));
 if(full.startsWith(base+path.sep)&&!full.startsWith(path.resolve(out)+path.sep)){
  p=path.join(out,'saidas-legadas',path.relative(base,full));fs.mkdirSync(path.dirname(p),{recursive:true});
 }else if(!full.startsWith(path.resolve(out)+path.sep))throw Error('Escrita fora da saída de teste: '+full);
 return write(p,...args);
};
