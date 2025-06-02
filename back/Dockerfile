# Use a imagem oficial do PostgreSQL
FROM postgres:latest

# Defina a variável de ambiente para configurar o Postgres para criar o banco de dados
ENV POSTGRES_DB nexMoney

# Copie o script SQL para criar o banco de dados
# COPY init.sql /docker-entrypoint-initdb.d/

# Defina a porta padrão para o PostgreSQL
EXPOSE 5432
