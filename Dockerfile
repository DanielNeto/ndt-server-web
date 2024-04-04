FROM measurementlab/ndt-server:v0.20.20
RUN rm -fr /html/
COPY html/ /html/