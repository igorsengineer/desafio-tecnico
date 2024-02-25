run:
	docker-compose -f build/docker-compose.yaml up -d && sleep 5

down:
	docker-compose -f build/docker-compose.yaml down

test:
	docker-compose -f build/docker-compose.yaml exec app php artisan test

setup:
	cp .env.example .env && \
	docker-compose -f build/docker-compose.yaml exec app composer install && \
	docker-compose -f build/docker-compose.yaml exec app php artisan key:generate && \
	docker-compose -f build/docker-compose.yaml exec app php artisan migrate
