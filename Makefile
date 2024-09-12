start-db:
	docker compose -f docker-compose-psql.yml up -d

stop-db:
	docker compose -f docker-compose-psql.yml down