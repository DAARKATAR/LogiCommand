FROM alpine:latest AS downloader
WORKDIR /data
RUN apk add --no-cache wget
# Descargar el mapa de Colombia (Geofabrik)
RUN wget http://download.geofabrik.de/south-america/colombia-latest.osm.pbf -O colombia.osm.pbf

FROM ghcr.io/project-osrm/osrm-backend:latest
WORKDIR /data
COPY --from=downloader /data/colombia.osm.pbf /data/colombia.osm.pbf

# Procesar los grafos de enrutamiento (Perfil de auto)
RUN osrm-extract -p /opt/car.lua /data/colombia.osm.pbf
RUN osrm-partition /data/colombia.osrm
RUN osrm-customize /data/colombia.osrm

EXPOSE 5000
CMD ["osrm-routed", "--algorithm", "mld", "/data/colombia.osrm"]
