import sys
import time
from datetime import datetime
from uuid import uuid4

from flask.sessions import SessionInterface as FlaskSessionInterface
from flask.sessions import SessionMixin
from flask_session import (
    NullSessionInterface,
    RedisSessionInterface,
    MemcachedSessionInterface,
    FileSystemSessionInterface,
    MongoDBSessionInterface,
    SqlAlchemySessionInterface,
)
from werkzeug.datastructures import CallbackDict
from itsdangerous import Signer, BadSignature, want_bytes

from flask_session import Session, MongoDBSessionInterface
import os


class FixedMongoSessionInterface(MongoDBSessionInterface):
    def __init__(self, *args, **kwargs):
        super(FixedMongoSessionInterface, self).__init__(*args, **kwargs)

    def open_session(self, app, request):
        sid = request.cookies.get(app.session_cookie_name)
        if not sid:
            sid = self._generate_sid()
            return self.session_class(sid=sid, permanent=self.permanent)
        if self.use_signer:
            signer = self._get_signer(app)
            if signer is None:
                return None
            try:
                sid_as_bytes = signer.unsign(sid)
                sid = sid_as_bytes.decode()
            except BadSignature:
                sid = self._generate_sid()
                return self.session_class(sid=sid, permanent=self.permanent)

        store_id = self.key_prefix + sid
        document = self.store.find_one({"id": store_id})
        if document and document.get("expiration") <= datetime.utcnow():
            # Delete expired session
            self.store.delete_one({"id": store_id})
            document = None
        if document is not None:
            try:
                val = document["val"]
                data = self.serializer.loads(want_bytes(val))
                return self.session_class(data, sid=sid)
            except:
                return self.session_class(sid=sid, permanent=self.permanent)
        return self.session_class(sid=sid, permanent=self.permanent)

    def save_session(self, app, session, response):
        domain = self.get_cookie_domain(app)
        path = self.get_cookie_path(app)
        store_id = self.key_prefix + session.sid
        if not session:
            if session.modified:
                self.store.delete_one({"id": store_id})
                response.delete_cookie(
                    app.session_cookie_name, domain=domain, path=path
                )
            return

        conditional_cookie_kwargs = {}
        httponly = self.get_cookie_httponly(app)
        secure = self.get_cookie_secure(app)
        if self.has_same_site_capability:
            conditional_cookie_kwargs["samesite"] = self.get_cookie_samesite(app)
        expires = self.get_expiration_time(app, session)
        val = self.serializer.dumps(dict(session))
        self.store.update_one(
            {"id": store_id},
            {"$set": {"id": store_id, "val": val, "expiration": expires}},
            True,
        )
        if self.use_signer:
            session_id = self._get_signer(app).sign(want_bytes(session.sid))
        else:
            session_id = session.sid
        response.set_cookie(
            app.session_cookie_name,
            session_id,
            expires=expires,
            httponly=httponly,
            domain=domain,
            path=path,
            secure=secure,
            **conditional_cookie_kwargs
        )


class FixedSession(Session):
    def __init__(self, *args, **kwargs):
        super(FixedSession, self).__init__(*args, **kwargs)

    def init_app(self, app):
        """This is used to set up session for your app object.

        :param app: the Flask app object with proper configuration.
        """
        app.session_interface = self._get_interface(app)

    def _get_interface(self, app):
        config = app.config.copy()
        config.setdefault("SESSION_TYPE", "null")
        config.setdefault("SESSION_PERMANENT", True)
        config.setdefault("SESSION_USE_SIGNER", False)
        config.setdefault("SESSION_KEY_PREFIX", "session:")
        config.setdefault("SESSION_REDIS", None)
        config.setdefault("SESSION_MEMCACHED", None)
        config.setdefault(
            "SESSION_FILE_DIR", os.path.join(os.getcwd(), "flask_session")
        )
        config.setdefault("SESSION_FILE_THRESHOLD", 500)
        config.setdefault("SESSION_FILE_MODE", 384)
        config.setdefault("SESSION_MONGODB", None)
        config.setdefault("SESSION_MONGODB_DB", "flask_session")
        config.setdefault("SESSION_MONGODB_COLLECT", "sessions")
        config.setdefault("SESSION_SQLALCHEMY", None)
        config.setdefault("SESSION_SQLALCHEMY_TABLE", "sessions")

        if config["SESSION_TYPE"] == "redis":
            session_interface = RedisSessionInterface(
                config["SESSION_REDIS"],
                config["SESSION_KEY_PREFIX"],
                config["SESSION_USE_SIGNER"],
                config["SESSION_PERMANENT"],
            )
        elif config["SESSION_TYPE"] == "memcached":
            session_interface = MemcachedSessionInterface(
                config["SESSION_MEMCACHED"],
                config["SESSION_KEY_PREFIX"],
                config["SESSION_USE_SIGNER"],
                config["SESSION_PERMANENT"],
            )
        elif config["SESSION_TYPE"] == "filesystem":
            session_interface = FileSystemSessionInterface(
                config["SESSION_FILE_DIR"],
                config["SESSION_FILE_THRESHOLD"],
                config["SESSION_FILE_MODE"],
                config["SESSION_KEY_PREFIX"],
                config["SESSION_USE_SIGNER"],
                config["SESSION_PERMANENT"],
            )
        elif config["SESSION_TYPE"] == "mongodb":
            session_interface = FixedMongoSessionInterface(
                config["SESSION_MONGODB"],
                config["SESSION_MONGODB_DB"],
                config["SESSION_MONGODB_COLLECT"],
                config["SESSION_KEY_PREFIX"],
                config["SESSION_USE_SIGNER"],
                config["SESSION_PERMANENT"],
            )
        elif config["SESSION_TYPE"] == "sqlalchemy":
            session_interface = SqlAlchemySessionInterface(
                app,
                config["SESSION_SQLALCHEMY"],
                config["SESSION_SQLALCHEMY_TABLE"],
                config["SESSION_KEY_PREFIX"],
                config["SESSION_USE_SIGNER"],
                config["SESSION_PERMANENT"],
            )
        else:
            session_interface = NullSessionInterface()

        return session_interface
