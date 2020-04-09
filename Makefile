.PHONY: push
push:
	okteto build -t okteto/upc-pool:node-dev --target dev .
	okteto build -t okteto/upc-pool:node .
