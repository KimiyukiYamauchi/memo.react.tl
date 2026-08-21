git fetch --all

for branch in $(git branch -r | grep -v '\->'); do
  local_branch="${branch#origin/}"
  echo "creating local branch: $local_branch"
  git branch --track "$local_branch" "$branch" 2>/dev/null
done