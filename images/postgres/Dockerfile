FROM postgres:14-bullseye
ENV PG_MAJOR 14
RUN apt-get update; \
    apt-get install -y --no-install-recommends \
    postgresql-$PG_MAJOR-pgaudit \
    libdbi-perl	\
    libdbd-pg-perl \
    nano 
RUN	rm -rf /var/lib/apt/lists/*