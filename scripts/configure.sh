docker compose up -d
docker exec -it --user postgres odoo-db psql -f /opt/scripts/create_odoo_user.sql
docker restart odoo-web
run 'npm install' to install the dependencies
run 'npm start' to start the application
run 'npm run dev' to start the application with pino-colada pretty logging (not suitable for production)
run 'npm test' to execute the unit tests
