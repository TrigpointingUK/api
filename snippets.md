# Useful bits of stuff

To test github language analysis... Edit `.gitattributes`, commit to git, then run...

```bash
docker run -t --rm -v "$(pwd):/repo" crazymax/linguist:latest
```
