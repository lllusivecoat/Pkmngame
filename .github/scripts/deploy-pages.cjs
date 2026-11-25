// Publish the verified artifact by its explicit REST ID. Avoid the separate
// artifact-service listing, which can incorrectly return an empty result.
module.exports=async({github,context,core,artifactId})=>{
  const owner=context.repo.owner,repo=context.repo.repo,id=Number(artifactId);
  if(!Number.isSafeInteger(id)||id<=0)throw Error('Invalid Pages artifact ID');
  // Use the run-scoped listing: the standalone artifact endpoint can return
  // 404 immediately after upload even when this verified run lists the file.
  const artifacts=(await github.rest.actions.listWorkflowRunArtifacts({owner,repo,run_id:context.runId,per_page:100})).data.artifacts;
  const artifact=artifacts.find(a=>a.id===id);
  if(!artifact)throw Error('Pages artifact must belong to this run');
  if(artifact.expired)throw Error('Pages artifact has expired');
  core.info(`Publishing verified Pages artifact ${id}`);
  const oidc_token=await core.getIDToken();
  const deployment=(await github.request('POST /repos/{owner}/{repo}/pages/deployments',{owner,repo,artifact_id:id,pages_build_version:context.sha,oidc_token})).data;
  core.setOutput('page_url',deployment.page_url||'https://lllusivecoat.github.io/Pkmngame/');
  const deploymentId=deployment.id||context.sha;
  for(let attempt=0;attempt<120;attempt++){
    await new Promise(resolve=>setTimeout(resolve,5000));
    const status=(await github.request('GET /repos/{owner}/{repo}/pages/deployments/{deploymentId}',{owner,repo,deploymentId})).data.status;
    core.info(`Pages status: ${status}`);
    if(status==='succeed'){core.setOutput('status','succeed');return;}
    if(/failed|errored|cancelled/.test(status))throw Error(`Pages deployment ${status}`);
  }
  throw Error('Pages deployment did not finish within ten minutes');
};
