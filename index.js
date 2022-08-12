const core = require("@actions/core");
const { Octokit } = require("@octokit/rest");

try {
  const octokit = new Octokit({
    auth: core.getInput("github_token")
  });
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
  octokit.rest.actions.listWorkflowRuns({
    owner,
    repo,
    workflow_id: core.getInput("workflow_id"),
    status: "completed",
    conclusion: "success",
    branch: core.getInput("branch"),
  }).then(({ data }) => {
    if (data.workflow_runs.length > 0) {
      core.setOutput("commit_sha", data.workflow_runs[0].head_sha);
    } else {
      core.warning("Unable to find last successful commit");
      core.setOutput("commit_sha", "");
    }
  }).catch((e) => {
    if (e.status === 404) {
      core.warning("Unable to find last successful commit");
      core.setOutput("commit_sha", "");
    } else {
      core.setFailed(e.message);
    }
  }); 
} catch (e) {
  core.setFailed(e.message);
}
