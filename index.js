const core = require("@actions/core");
const { Octokit } = require("@octokit/rest");

try {
  const octokit = new Octokit({
    auth: core.getInput("github_token")
  });
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
  octokit.rest.actions.listWorkflowRunsForRepo({
    owner,
    repo,
    workflow_id: core.getInput("workflow_id"),
    status: "completed",
    conclusion: "success",
    branch: core.getInput("branch"),
  }).then(({ data }) => {
    const head_sha = data.workflow_runs.length > 0 ? data.workflow_runs[0].head_sha : "";
    core.setOutput("commit_sha", head_sha);
  }).catch((e) => {
    core.setFailed(e.message);
  }); 
} catch (e) {
  core.setFailed(e.message);
}
