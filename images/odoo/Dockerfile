FROM python:3.9.18-slim-bullseye
USER root
RUN apt-get update -y
RUN apt-get upgrade -y
RUN  DEBIAN_FRONTEND=noninteractive apt-get install git build-essential wget libfreetype6-dev libxml2-dev libzip-dev libldap2-dev libsasl2-dev nodejs npm libjpeg-dev \
    xfonts-75dpi xfonts-base libffi-dev fontconfig node-less libjpeg-dev zlib1g-dev libpq-dev libxslt1-dev libldap2-dev libtiff5-dev libjpeg62-turbo-dev libopenjp2-7-dev \
    liblcms2-dev libwebp-dev libharfbuzz-dev libfribidi-dev libxcb1-dev nano screen curl htop supervisor -y
RUN sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt bullseye-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
RUN apt-get update -y
RUN apt-get -y install postgresql-client-14 -y 
RUN wget -O /tmp/wkhtmltox_0.12.6.1-2.bullseye_amd64.deb https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6.1-2/wkhtmltox_0.12.6.1-2.bullseye_amd64.deb
RUN apt-get install /tmp/wkhtmltox_0.12.6.1-2.bullseye_amd64.deb -y
RUN rm -rf /var/lib/apt/lists/*
RUN adduser --disabled-login devops
USER devops
ENV VIRTUAL_ENV=/home/devops/.venv
RUN python -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
RUN pip install --upgrade pip wheel
COPY ./server/requirements.txt /home/devops/requirements.txt
RUN pip install -r /home/devops/requirements.txt
RUN pip install pandas openpyxl erppeek email-validator pysaml2 \
    python-json-logger python-dotenv XlsxWriter boto3
USER root
RUN mkdir -p /opt/data
RUN chown -R devops:devops /opt/data
COPY ./supervisor/odoo-supervisord.conf /etc/supervisor/conf.d/supervisord.conf
CMD [ "/usr/bin/supervisord" ]