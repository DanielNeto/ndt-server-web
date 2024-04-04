.PHONY: all clean

all: configure build docker_build

configure:
	mkdir -p certs
	mkdir -p html
	mkdir -p resultsdir/ndt/ndt7/
	mkdir -p schemas

build:
	npm install
	npm install @angular/cli
	ng build
	cp -r dist/ndt-server/browser/* html/
	cp dist/ndt-server/3rdpartylicenses.txt html/

docker_build:
	docker compose -f docker-compose-full.yml build

clean:
	rm -fr dist/
	rm -fr html/