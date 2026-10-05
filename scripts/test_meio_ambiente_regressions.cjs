// Executa contratos anteriores sem sobrescrever evidências das rodadas P0/P1/P2.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const name=process.argv[2];if(!/^test_(?:radar_hub_p0|saude_runtime|economia_visual|financas_visual|economia_runtime|financas_runtime)\.cjs$/.test(name))throw Error('teste não permitido');
const filename=path.join(__dirname,name),out=path.resolve(__dirname,'../docs/dados-publicos-revisao/p3-meio-ambiente/compatibilidade',name.replace('.cjs',''));fs.mkdirSync(out,{recursive:true});
const write=fs.writeFileSync.bind(fs);fs.writeFileSync=(p,...args)=>write(String(p).includes('docs')?path.join(out,path.basename(p)):p,...args);
let source=fs.readFileSync(filename,'utf8');
if(name==='test_radar_hub_p0.cjs')source=source.replace("[['meio_ambiente','hubChartMeioAmbienteAr'],['economia','hubChartEconomiaEmprego'],['mobilidade','hubChartMobilidadeFatalidades']]","[['economia','hubChartEconomiaEmprego'],['mobilidade','hubChartMobilidadeFatalidades']]");
const m=new Module(filename,module);m.filename=filename;m.paths=Module._nodeModulePaths(__dirname);m._compile(source,filename);
