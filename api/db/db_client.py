import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import logging
from urllib.parse import quote

logger = logging.getLogger("db_client")


class DatabaseClient:
    def __init__(self) -> None:
        return

    def connect(self) -> None:
        logger.info("hello")
        uri = f"mongodb+srv://gisthub-api:{os.environ['MONGO_DB_PASSWORD']}@gisthub-cluster.xkmpwip.mongodb.net/?retryWrites=true&w=majority"
        self.client = MongoClient(uri, server_api=ServerApi("1"))["mhacks"]

        try:
            print("Pinged your deployment. You successfully connected to MongoDB!")
        except Exception as e:
            print(e)


db = DatabaseClient()
