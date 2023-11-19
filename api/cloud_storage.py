from google.cloud import storage
from google import auth

storage_client = storage.Client(project="gisthub")
credentials, project = auth.default()
credentials.refresh(auth.transport.requests.Request())
