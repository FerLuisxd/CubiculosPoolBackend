.PHONY: push
push:
	okteto build -t upc-pool:node-dev --target dev .
	okteto build -t upc-pool:node .
