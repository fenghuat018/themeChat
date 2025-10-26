import logging

try:
    import pymysql
except ImportError as exc:  # pragma: no cover - install-time safety
    logging.getLogger(__name__).warning("PyMySQL not available: %s", exc)
else:
    if not getattr(pymysql, "_mysql_db_installed", False):
        pymysql.install_as_MySQLdb()
        pymysql._mysql_db_installed = True
