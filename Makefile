.PHONY: build-development
build-dev: ## Build the development docker image.
	docker compose -f compose.yml build

.PHONY: start-development
start-dev: ## Start the development docker container.
	docker compose -f compose.yml up -d

.PHONY: stop-development
stop-dev: ## Stop the development docker container.
	docker compose -f compose.yml down