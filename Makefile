all: configure

configure:
	mkdir -p certs
	mkdir -p html
	mkdir -p resultsdir/ndt/ndt7/
	mkdir -p schemas

docker_build:
	docker run -it --volume ./:/home/node/app --workdir /home/node/app node:20-alpine sh -c "npm install && npm install -g @angular/cli && ng build"

build:
	ng build
	cp -r dist/ndt-server/browser/* html/
	cp dist/ndt-server/3rdpartylicenses.txt html/
	chmod 664 html/*