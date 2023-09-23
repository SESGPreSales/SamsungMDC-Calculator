# Use the official MongoDB image
FROM mongo:latest

# Set environment variables (optional)
ENV MONGO_INITDB_ROOT_USERNAME=admin
ENV MONGO_INITDB_ROOT_PASSWORD=mdcpassword

# Copy data file into the container
COPY mongoData/* /

# Copy import script into the container
COPY init/import-script.sh /docker-entrypoint-initdb.d/

# Make the import script executable
RUN chmod +x /docker-entrypoint-initdb.d/import-script.sh