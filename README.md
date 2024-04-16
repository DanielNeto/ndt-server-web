PORTAL NDT DOS POPS + NGINX EM CONTAINER - SEM CODIGO ANGULAR


## Setup

### Primary setup & running (Linux)

Prepare the runtime environment

```shell
install -d certs datadir var-spool-ndt var-local
```

To run the server locally, generate local self signed certificates (`key.pem`
and `cert.pem`) using bash and OpenSSL

```shell
./gen_local_test_certs.sh
```

```shell
docker-compose build
docker-compose up -d
```
