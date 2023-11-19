FROM python:3.11-slim

ENV PYTHONUNBUFFERED TRUE

ENV APP_HOME /app

ENV PORT 5050

ENV GOOGLE_APPLICATION_CREDENTIALS application_default_credentials.json

WORKDIR $APP_HOME

COPY . ./

RUN pip install --no-cache-dir -r requirements.txt

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 --capture-output --enable-stdio-inheritance main:app