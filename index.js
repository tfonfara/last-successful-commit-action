const core = require("@actions/core");
const github = require("@actions/github");

try {
  const octokit = github.getOctokit(core.getInput("github_token"));
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
  octokit.actions
    .listWorkflowRunsForRepo({
      owner,
      repo,
      workflow_id: core.getInput("workflow_id"),
      status: "completed",
      conclusion: "success",
      branch: core.getInput("branch"),
    })
    .then((res) => {
      const lastSuccessCommitHash =
        res.data.workflow_runs.length > 0
          ? res.data.workflow_runs[0].head_sha
          : "";
      core.setOutput("commit_sha", lastSuccessCommitHash);
    })
    .catch((e) => {
      core.setFailed(e.message);
    });
} catch (e) {
  core.setFailed(e.message);
}
