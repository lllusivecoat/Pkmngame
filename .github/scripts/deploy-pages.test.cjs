const test=require('node:test');
const assert=require('node:assert/strict');
const deploy=require('./deploy-pages.cjs');
function fixture(artifacts){
  const calls=[],outputs={};
  const github={
    rest:{actions:{async listWorkflowRunArtifacts(args){calls.push(args);return {data:{artifacts}};}}},
    async request(route,args){calls.push({route,args});return {data:route.startsWith('POST')?{id:'deploy',page_url:'https://example.test/'}:{status:'succeed'}};}
  };
  return {github,context:{repo:{owner:'lllusivecoat',repo:'Pkmngame'},runId:123,sha:'verified'},core:{info(){},async getIDToken(){return 'test-oidc';},setOutput(k,v){outputs[k]=v;}},calls,outputs};
}
test('reject invalid, expired and other-run artifacts before deployment',async()=>{
  for(const [id,artifacts,error] of [['bad',[],/Invalid/],[5,[{id:5,expired:true}],/expired/],[5,[{id:6,expired:false}],/belong/]]){
    const f=fixture(artifacts);await assert.rejects(()=>deploy({...f,artifactId:id}),error);assert.ok(!f.calls.some(c=>c.route?.startsWith('POST')));
  }
});
test('publish only the run-scoped verified ID without standalone metadata lookup',async()=>{
  const f=fixture([{id:5,expired:false}]),original=setTimeout;global.setTimeout=fn=>original(fn,0);
  try{await deploy({...f,artifactId:5});assert.equal(f.calls[0].run_id,123);assert.equal(f.calls[1].args.artifact_id,5);assert.equal(f.outputs.status,'succeed');}finally{global.setTimeout=original;}
});
